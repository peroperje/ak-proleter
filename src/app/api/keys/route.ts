import { NextResponse } from 'next/server';
import prisma from '@/app/lib/prisma';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { modelId, key, userId } = body;
    
    if (!modelId || !key) {
       return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Check if key already exists for this model
    const existingKey = await prisma.aIKey.findFirst({
      where: { modelId }
    });
    
    let aiKey;
    if (existingKey) {
      aiKey = await prisma.aIKey.update({
        where: { id: existingKey.id },
        data: { key, userId }
      });
    } else {
      aiKey = await prisma.aIKey.create({
        data: {
          modelId,
          key,
          userId
        }
      });
    }
    
    return NextResponse.json({ 
      id: aiKey.id, 
      modelId: aiKey.modelId,
      message: 'Key saved successfully'
    });
  } catch (error) {
    console.error('Error saving AI key:', error);
    return NextResponse.json({ error: 'Failed to save key' }, { status: 500 });
  }
}
