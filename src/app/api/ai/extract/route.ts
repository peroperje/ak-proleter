import { NextResponse } from 'next/server';
import prisma from '@/app/lib/prisma';
import { AIService } from '@/app/lib/service/AISevice';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { prompt, role, language, contextHints, modelId } = body;
    
    // If no modelId provided, use the first one that has a key
    let model;
    if (modelId) {
      model = await prisma.aIModel.findUnique({
        where: { id: modelId },
        include: { keys: true }
      });
    } else {
      model = await prisma.aIModel.findFirst({
        where: {
          keys: { some: {} }
        },
        include: { keys: true }
      });
    }
    
    if (!model || model.keys.length === 0) {
      // Fallback to HF env key if available for backward compatibility
      const hfKey = process.env.NEXT_PUBLIC_HF_API_KEY;
      if (hfKey) {
        const aiService = new AIService("Extract athletic data", {
          id: 'env-default',
          name: 'Environment Default',
          provider: 'huggingface',
          modelName: 'deepseek-ai/DeepSeek-V3-0324',
          apiKey: hfKey
        });
        const result = await aiService.extractData(prompt, role, language, contextHints);
        return NextResponse.json(result);
      }
      return NextResponse.json({ error: 'No AI model with API key configured' }, { status: 404 });
    }
    
    // In a real app we'd handle multiple keys or per-user keys
    const config = {
      id: model.id,
      name: model.name,
      provider: model.provider,
      modelName: model.modelName,
      apiKey: model.keys[0].key
    };
    
    const aiService = new AIService("Extract athletic data", config);
    const result = await aiService.extractData(prompt, role, language, contextHints);
    
    return NextResponse.json(result);
  } catch (error) {
    console.error('AI extraction error:', error);
    return NextResponse.json({ error: 'Failed to process AI request' }, { status: 500 });
  }
}
