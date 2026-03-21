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
  disciplineName: string;
  dataType: "RESULT";
}

export async function POST(req: NextRequest) {
  try {
    const session = await getApiSession();

    if (!session || !session.user || !session.user.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // 1. Get athleteId
    const athlete = await prisma.athlete.findUnique({
      where: { userId: session.user.id }
    });

    if (!athlete) {
      return NextResponse.json({ error: 'Athlete profile not found' }, { status: 404 });
    }
    const athleteId = athlete.id;

    // 2. Load disciplines for exact matching
    const allDisciplines = await prisma.discipline.findMany({
      select: { id: true, name: true }
    });
    const disciplineNames = allDisciplines.map(d => d.name);

    const dynamicPrompt = `${DEFAULT_PROMPT}

When dataType is "RESULT", you MUST map the spoken discipline to one of the exact strings from this list. Do not invent names.

VALID DISCIPLINES:
${JSON.stringify(disciplineNames)}

EXTRACTED FORMAT REQUIREMENT:
Ensure the returned JSON includes "disciplineName" with the perfectly matched string from the VALID DISCIPLINES list.
`;

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
    const aiService = new AIService(dynamicPrompt, modelConfig);
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

    // Validate discipline
    const extractedDisciplineName = resultData.disciplineName;
    const matchedDiscipline = allDisciplines.find(d => d.name === extractedDisciplineName);

    if (!matchedDiscipline) {
        return NextResponse.json({
            error: 'Could not map discipline exactly.',
            details: { extractedName: extractedDisciplineName }
        }, { status: 422 });
    }
    const disciplineId = matchedDiscipline.id;

    console.log('Extracted Result:', resultData);

    // Get or Create Event (Time-Boxed Proximity Matching)
    const recordTime = new Date(timestamp);
    const startOfDay = new Date(recordTime);
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(recordTime);
    endOfDay.setHours(23, 59, 59, 999);

    let targetEvent = await prisma.event.findFirst({
      where: {
        startDate: {
          gte: startOfDay,
          lte: endOfDay,
        },
      },
      orderBy: {
        startDate: 'desc',
      },
    });

    if (!targetEvent) {
      targetEvent = await prisma.event.create({
        data: {
          title: 'Dnevni trening',
          location:
            location ||
            'Стадион, Карађорђев трг, МЗ Центар, Zrenjanin, City of Zrenjanin, Central Banat Administrative District, Vojvodina, 23101, Serbia',
          lat: lat || 45.387256,
          lng: lon || 20.3998004,
          startDate: recordTime,
          type: 'TRAINING',
          organizerId: session.user.id,
        },
      });
    }

    const eventId = targetEvent.id;

    // 3. Persistence
    const newResult = await prisma.result.create({
      data: {
        athleteId,
        disciplineId,
        eventId,
        score: resultData.score.toString(),
        notes: "Inserted by Voice Assistant",
      }
    });

    return NextResponse.json({
      success: true,
      message: `Result recorded successfully`,
      data: newResult
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
