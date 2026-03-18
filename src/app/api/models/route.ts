import { NextResponse } from 'next/server';
import prisma from '@/app/lib/prisma';

export async function GET() {
  try {
    const models = await prisma.aIModel.findMany({
      include: {
        keys: {
          select: {
            id: true,
            userId: true
          }
        }
      }
    });
    
    // Map to include has_key
    const result = models.map(m => ({
      id: m.id,
      name: m.name,
      provider: m.provider,
      model_name: m.modelName, // Matching the field name in the reference UI
      has_key: m.keys.length > 0,
      createdAt: m.createdAt,
      updatedAt: m.updatedAt
    }));
    
    return NextResponse.json(result);
  } catch (error) {
    console.error('Error fetching AI models:', error);
    return NextResponse.json({ error: 'Failed to fetch models' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, provider, model_name } = body;
    
    if (!name || !provider || !model_name) {
       return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const model = await prisma.aIModel.create({
      data: {
        name,
        provider,
        modelName: model_name
      }
    });
    
    return NextResponse.json(model);
  } catch (error) {
    console.error('Error creating AI model:', error);
    return NextResponse.json({ error: 'Failed to create model' }, { status: 500 });
  }
}
