import { NextRequest, NextResponse } from 'next/server';
import { getApiSession } from '@/app/lib/api-auth';
import { AIService } from '@/app/lib/service/AIService';
import { prisma } from '@/app/lib/prisma';

const DEFAULT_PROMPT = `
### ROLE
You are a high-precision athletic data extractor.

### EXTRACTION RULES (Chain of Thought)
For every input, you must follow these steps in your internal logic:
1. Identify the numeric value and the separator (comma or dot).
2. Count the digits after the separator.
3. If 1 digit (e.g., ,7), it is Tenths -> Convert to Hundredths (7 * 10 = 70).
4. If 2 digits (e.g., ,07), it is Hundredths -> Keep as is (07).
5. Always output 'minutes', 'seconds', and 'hundredths' as STRINGS. Preserve leading zeros for hundredths (2-character string).

### EXTRACTION SCHEMA
- analysis: A logical analysis explaining how you extracted the values, especially for decimals.
- disciplineName: THE PERFECTLY MATCHED string from the VALID DISCIPLINES list.
- resultType: MUST be exactly one of "TIME", "DISTANCE", "WEIGHT", "POINTS", or "COUNT".
- score: Numeric value if resultType is NOT "TIME". If it is "TIME", output null.
- timeParts: If resultType is "TIME", output an object:
    * minutes: string
    * seconds: string
    * hundredths: string (2 characters, e.g., "70" or "03")
  If resultType is NOT "TIME", output null.

### FEW-SHOT EXAMPLES
User: "100m za 9,7"
Output: {
  "analysis": "The value is 9,7. There is one digit after the comma (7), which represents 70 hundredths.",
  "disciplineName": "100 meters",
  "resultType": "TIME",
  "timeParts": {"minutes": "0", "seconds": "9", "hundredths": "70"},
  "score": null
}

User: "100m za 15,03"
Output: {
  "analysis": "The value is 15,03. There are two digits after the comma (03), which represents 03 hundredths.",
  "disciplineName": "100 meters",
  "resultType": "TIME",
  "timeParts": {"minutes": "0", "seconds": "15", "hundredths": "03"},
  "score": null
}
`;

interface ExtractedResult {
  analysis: string;
  disciplineName: string;
  resultType: string;
  score: string | number | null;
  timeParts: {
    minutes: string;
    seconds: string;
    hundredths: string;
  } | null;
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
You MUST map the spoken discipline to one of the exact strings from this list. Do not invent names.
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
        currentDate: requestDate.toISOString().split('T')[0],
    };

    // 1. Process with AI
    const aiService = new AIService(dynamicPrompt, modelConfig);
    const resultData = await aiService.extractData<ExtractedResult>(
      voiceInput,
      userRole,
      language,
      contextHints
    );

    // 2. Validation Logic
    if (!resultData) {
        return NextResponse.json({
            error: 'AI could not extract a valid result.'
        }, { status: 422 });
    }

    let numericScore: number | null = null;
    if (resultData.resultType === 'TIME' && resultData.timeParts) {
      const { minutes, seconds, hundredths } = resultData.timeParts;
      const parsedMinutes = parseInt(minutes, 10) || 0;
      const parsedSeconds = parseInt(seconds, 10) || 0;
      const parsedHundredths = parseInt(hundredths, 10) || 0;
      numericScore = (parsedMinutes * 60) + parsedSeconds + (parsedHundredths / 100);
    } else if (resultData.score !== null && resultData.score !== undefined) {
      numericScore = Number(resultData.score);
    }

    // Basic verification for Result fields: score
    if (numericScore === null || isNaN(numericScore)) {
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
        score: numericScore.toString(),
        notes: "Inserted by Voice Assistant",
      }
    });

    // 4. Log processing tracking data
    await prisma.voiceLog.create({
      data: {
        // eslint-disable-next-line
        requestData: body as any,
        // eslint-disable-next-line
        aiResponse: resultData as any,
        resultId: newResult.id,
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
