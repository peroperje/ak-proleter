import { NextRequest, NextResponse } from 'next/server';
import { getApiSession } from '@/app/lib/api-auth';
import { AIService } from '@/app/lib/service/AIService';
import { prisma } from '@/app/lib/prisma';

const DEFAULT_PROMPT = `
You are an expert athletic club data extractor. Analyze the provided voice input and extract structured information into a JSON object.

1. **Classification**: First, determine if the input represents an "EVENT" or a "RESULT".
   - If User Role is ADMIN, both types are possible.
   - If User Role is ATHLETE, it is ALWAYS a "RESULT".

2. **Extraction Schemas**:

   - **dataType: "EVENT"**:
     - title: Name of the event or activity.
     - description: Any extra notes or description (optional).
     - location: Specific venue or address.
     - startDate: ISO DateTime. Use relative time understanding based on context timestamp.
     - endDate: ISO DateTime if available.
     - lat/lng: Geographic coordinates if mentioned.
     - type: Categorize into one of these: [COMPETITION, TRAINING, MEETING, OTHER, CAMP].

   - **dataType: "RESULT"**:
     - athleteName: Full name of the athlete.
     - score: The numeric value of the performance.
     - scoreUnit: The units for the score. Use specific symbols ONLY: [s, min, h, m, km, pts, cnt, kg, cm, ms].

3. **Contextual Fallback**:
   - If "location", "lat", or "lng" are NOT mentioned in the voice input, set them to null in the JSON. (The backend will then use the device-provided context values if necessary).

4. **Response Format**:
   - Output ONLY a valid JSON object.
`;

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

    // Construct richer context hints
    const contextHints = {
        timestamp,
        location,
        lat,
        lng: lon // Normalizing 'lon' to 'lng' for the AI and Prisma
    };

    // 1. Process with AI
    const aiService = new AIService(DEFAULT_PROMPT, modelConfig);
    const resultData = await aiService.extractData<any>(
      voiceInput,
      userRole,
      language,
      contextHints
    );

    console.log('resultData', resultData);

    // 2. Validation Logic
    if (!resultData || !resultData.dataType) {
        return NextResponse.json({
            error: 'AI could not categorize the input.',
            details: resultData
        }, { status: 422 });
    }

    if (resultData.dataType === 'EVENT') {
        // Basic verification for Event fields: title, startDate, type
        if (!resultData.title || !resultData.startDate || !resultData.type) {
            return NextResponse.json({
                error: 'AI failed to extract required Event fields (title, startDate, or type)',
                details: resultData
            }, { status: 422 });
        }
        console.log('Extracted Event:', resultData);
    } else if (resultData.dataType === 'RESULT') {
        // Basic verification for Result fields: athleteName, score
        if (!resultData.athleteName || !resultData.score) {
            return NextResponse.json({ error: 'AI failed to extract required Result fields (athleteName, score)' }, { status: 422 });
        }
        console.log('Extracted Result:', resultData);
    }

    // 3. Persistence (Disabled for now as per previous conversation)
    /*
    if (resultData.dataType === 'RESULT') {
        // Save result...
    } else if (resultData.dataType === 'EVENT') {
        // Save event...
    }
    */

    return NextResponse.json({
      success: true,
      message: `${resultData.dataType} recorded successfully`,
      data: resultData
    });

  } catch (error: any) {
    console.error('Voice Processing API Error:', error);
    return NextResponse.json({
      error: 'Internal Server Error',
      message: error.message
    }, { status: 500 });
  }
}
