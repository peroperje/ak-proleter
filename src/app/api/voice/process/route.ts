import { NextRequest, NextResponse } from 'next/server';
import { getApiSession } from '@/app/lib/api-auth';
import { AIService } from '@/app/lib/service/AIService';
import { prisma } from '@/app/lib/prisma';

const DEFAULT_PROMPT = `
You are an expert athletic club data extractor. Analyze the provided voice input and extract athletic performance results into a JSON object.

1. **Extraction Schema**:
   - score: The numeric value of the performance.
   - scoreUnit: The units for the score. Use specific symbols ONLY: [s, min, h, m, km, pts, cnt, kg, cm, ms].
   - dataType: Always set to "RESULT".

2. **Contextual Fallback**:
   - If "location", "lat", or "lng" matching the voice input are NOT mentioned, the values should be null. (The backend will then use the device-provided context values if necessary).

3. **Response Format**:
   - Output ONLY a valid JSON object.
`;

interface ExtractedResult {
  score: string | number;
  scoreUnit: string;
  dataType: "RESULT";
}

export async function POST(req: NextRequest) {
  try {
    const session = await getApiSession();

    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const { transcription, text, timestamp, location, lat, lon, language = 'sr-RS' } = body;
    const voiceInput = transcription || text;

    if (!voiceInput) {
      return NextResponse.json({ error: 'Missing transcription or text' }, { status: 400 });
    }
    console.log({
      transcription,
      text,
      timestamp,
      location,
      lat,
      lon,
      language,
    });
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

    const requestDate = new Date(timestamp);
    const contextHints = {
        timestamp,
        currentDate: requestDate.toISOString().split('T')[0],
        currentTime: requestDate.toLocaleTimeString('sr-RS', { hour12: false }),
        location,
        lat,
        lng: lon // Normalizing 'lon' to 'lng' for the AI and Prisma
    };

    // 1. Process with AI
    const aiService = new AIService(DEFAULT_PROMPT, modelConfig);
    const resultData = await aiService.extractData<ExtractedResult>(
      voiceInput,
      userRole,
      language,
      contextHints
    );

    console.log('resultData', resultData);

    // 2. Validation Logic
    if (!resultData || resultData.dataType !== 'RESULT') {
        return NextResponse.json({
            error: 'AI could not extract a valid result.',
            details: resultData
        }, { status: 422 });
    }

    // Basic verification for Result fields: score
    if (!resultData.score) {
        return NextResponse.json({ error: 'AI failed to extract required Result fields (score)' }, { status: 422 });
    }
    console.log('Extracted Result:', resultData);

    // 3. Persistence (Disabled for now as per previous conversation)
    /*
    // In the future, we will use session.user.id or athleteId to save the result
    */

    return NextResponse.json({
      success: true,
      message: `Result recorded successfully`,
      data: resultData
    });

  } catch (error: unknown) {
    const err = error as Error;
    console.error('Voice Processing API Error:', err);
    return NextResponse.json({
      error: 'Internal Server Error',
      message: err.message
    }, { status: 500 });
  }
}
