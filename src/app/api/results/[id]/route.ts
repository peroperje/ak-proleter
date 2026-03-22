import { NextRequest, NextResponse } from 'next/server';
import { getApiSession } from '@/app/lib/api-auth';
import { prisma } from '@/app/lib/prisma';

/**
 * DELETE /api/results/[id]
 * Deletes a result and its associated voice logs.
 * Only the athlete who owns the result can delete it.
 */
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: resultId } = await params;

    // 1. Authenticate
    const session = await getApiSession();
    if (!session || !session.user || !session.user.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // 2. Identify Athlete
    const athlete = await prisma.athlete.findUnique({
      where: { userId: session.user.id },
    });

    if (!athlete) {
      return NextResponse.json({ error: 'Athlete profile not found' }, { status: 404 });
    }

    // 3. Find Result and verify ownership
    const result = await prisma.result.findUnique({
      where: { id: resultId },
    });

    if (!result) {
      return NextResponse.json({ error: 'Result not found' }, { status: 404 });
    }

    if (result.athleteId !== athlete.id) {
      return NextResponse.json({ error: 'Forbidden: You can only delete your own results' }, { status: 403 });
    }

    // 4. Perform Deletion in Transaction
    // Even though VoiceLog has onDelete: SetNull in schema.prisma, 
    // the requirement is to delete them if they exist.
    await prisma.$transaction(async (tx) => {
      // Delete any associated VoiceLogs
      await tx.voiceLog.deleteMany({
        where: { resultId: resultId },
      });

      // Delete any associated Activities (Cascade handles this usually, but let's be safe if needed)
      // Activity has resultId?, eventId? and onDelete: Cascade in schema.
      // So we don't strictly need to delete activities manually if cascade is working.
      // But let's check schema again. Lines 161-163 in schema.prisma show Activity @relation(..., onDelete: Cascade)
      
      // Delete the Result
      await tx.result.delete({
        where: { id: resultId },
      });
    });

    return NextResponse.json({
      success: true,
      message: 'Result and associated voice logs deleted successfully',
    });
  } catch (error: unknown) {
    const err = error as Error;
    console.error('Delete Result API Error:', err);
    return NextResponse.json(
      {
        error: 'Internal Server Error',
        message: err.message,
      },
      { status: 500 }
    );
  }
}
