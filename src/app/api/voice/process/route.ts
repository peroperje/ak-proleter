import { NextRequest, NextResponse } from 'next/server';
import { getApiSession } from '@/app/lib/api-auth';
import { AIService } from '@/app/lib/service/AISevice';
import { prisma } from '@/app/lib/prisma';

const DEFAULT_PROMPT = `
Extract athletic result data from the text. 
The result should include ONLY:
- athleteName (string)
- score (string or number)
- scoreUnit (string)

If the text is in Serbian, translate terminology to understand the intent but keep the names as provided.
`;

export async function POST(req: NextRequest) {
  try {
    const session = await getApiSession();

    console.log('session', session);
    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const { transcription, text, timestamp, location, lat, lon, language = 'sr-RS' } = body;
    const voiceInput = transcription || text;
    console.log('voiceInput', voiceInput);
    if (!voiceInput) {
      return NextResponse.json({ error: 'Missing transcription or text' }, { status:400 });
    }

    const userRole = session.user.role || 'USER';

    // Get Active Model from DB (fallback to default if not configured)
    const activeModel = await prisma.aIModel.findFirst({
      include: { keys: true },
      orderBy: { updatedAt: 'desc' }
    });

    let modelConfig;
    if (activeModel) {
      modelConfig = {
        id: activeModel.id,
        name: activeModel.name,
        provider: activeModel.provider,
        modelName: activeModel.modelName,
        apiKey: activeModel.keys?.[0]?.key || ''
      };
    }

    // 1. Process with AI
    const aiService = new AIService(DEFAULT_PROMPT, modelConfig);
    console.log({voiceInput, userRole, language, timestamp, location, lat, lon, modelConfig});
    const resultData = await aiService.extractData<any>(
      voiceInput,
      userRole,
      language,
      { timestamp, location }
    );

    console.log('resultData', resultData);
    if (!resultData || !resultData.athleteName || !resultData.score) {
      return NextResponse.json({
        error: 'AI failed to extract required fields (athleteName, score, scoreUnit)',
        details: resultData
      }, { status: 422 });
    }

    // 3. Persistence
    /*
    const newResult = await prisma.result.create({
      data: {
        athleteId: resultData.athleteId,
        eventId: resultData.eventId,
        disciplineId: resultData.disciplineId,
        score: resultData.score,
        notes: resultData.notes || '',
      },
    });
*/
    return NextResponse.json({
      success: true,
      message: 'Result recorded successfully',
  //    data: newResult,
     data:{}
    });

  } catch (error: any) {
    console.error('Voice Processing API Error:', error);
    return NextResponse.json({
      error: 'Internal Server Error',
      message: error.message
    }, { status: 500 });
  }
}
