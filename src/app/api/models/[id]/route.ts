import { NextResponse } from 'next/server';
import prisma from '@/app/lib/prisma';

export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    
    if (!id) {
       return NextResponse.json({ error: 'Missing model ID' }, { status: 400 });
    }

    await prisma.aIModel.delete({
      where: { id }
    });
    
    return NextResponse.json({ message: 'Model deleted' });
  } catch (error) {
    console.error('Error deleting AI model:', error);
    return NextResponse.json({ error: 'Failed to delete model' }, { status: 500 });
  }
}
