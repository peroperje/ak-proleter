import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { AIService, ContextHints } from '@/app/lib/service/AISevice';
import prisma from '@/app/lib/prisma';

const DEFAULT_PROMPT = `
Extract athletic result data from the text. 
The result should include:
- athleteId (string, UUID)
- eventId (string, UUID)
- disciplineId (string, UUID)
- score (string, e.g., "12.5s", "5.43m")
- notes (string, optional)

If the text is in Serbian, translate terminology to understand the intent but keep the IDs as provided in context hints.
`;

export async function POST(req: NextRequest) {
  try {
    const session = await auth();

    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const { transcription, contextHints, language = 'sr-RS' } = body;

    if (!transcription) {
      return NextResponse.json({ error: 'Missing transcription' }, { status:400 });
    }

    const userRole = session.user.role || 'USER';
    const userId = session.user.id;

    // 1. Process with AI
    const aiService = new AIService(DEFAULT_PROMPT);
    const resultData = await aiService.extractData<any>(
      transcription,
      userRole,
      language,
      contextHints as ContextHints
    );

    if (!resultData || !resultData.athleteId || !resultData.eventId || !resultData.disciplineId) {
      return NextResponse.json({ 
        error: 'AI failed to extract required fields', 
        details: resultData 
      }, { status: 422 });
    }

    // 2. RBAC Validation
    if (userRole !== 'ADMIN') {
      // If the user is an ATHLETE, they can only record for themselves
      const athlete = await prisma.athlete.findUnique({
        where: { userId: userId },
      });

      if (!athlete || resultData.athleteId !== athlete.id) {
        return NextResponse.json({ 
          error: 'Forbidden: You can only record results for yourself.' 
        }, { status: 403 });
      }
    }

    // 3. Persistence
    const newResult = await prisma.result.create({
      data: {
        athleteId: resultData.athleteId,
        eventId: resultData.eventId,
        disciplineId: resultData.disciplineId,
        score: resultData.score,
        notes: resultData.notes || '',
      },
    });

    return NextResponse.json({
      success: true,
      message: 'Result recorded successfully',
      data: newResult,
    });

  } catch (error: any) {
    console.error('Voice Processing API Error:', error);
    return NextResponse.json({ 
      error: 'Internal Server Error', 
      message: error.message 
    }, { status: 500 });
  }
}
