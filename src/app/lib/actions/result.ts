'use server';

import { z } from 'zod';
import prisma from '@/app/lib/prisma';
import { revalidatePath } from 'next/cache';
import { routes } from '@/app/lib/routes';
import { redirect } from 'next/navigation';

export type State = {
  errors?: {
    athleteId?: string[];
    eventId?: string[];
    disciplineId?: string[];
    position?: string[];
    score?: string[];
    notes?: string[];
  };
  message: string;
};

const ResultSchema = z.object({
  athleteId: z.string(),
  eventId: z.string(),
  disciplineId: z.string(),
  position: z.coerce.number().optional(),
  score: z.string().optional(),
  notes: z.string().optional(),
});

export async function createResult(prevState: State, formData: FormData): Promise<State> {
  const validatedFields = ResultSchema.safeParse(Object.fromEntries(formData.entries()));

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Validation Error: Failed to create result.',
    };
  }

  let result;
  try {
    result = await prisma.result.create({
      data: {
        ...validatedFields.data,
      },
    });
  } catch {
    return {
      message: 'Database Error: Failed to create result.',
    };
  }

  revalidatePath(routes.results.new());
  redirect(routes.results.view(result.id));
}

