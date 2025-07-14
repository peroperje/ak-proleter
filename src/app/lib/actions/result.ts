'use server';

import { z } from 'zod';
import prisma from '@/app/lib/prisma';
import { revalidatePath } from 'next/cache';
import { routes } from '@/app/lib/routes';
import { redirect } from 'next/navigation';

const ResultSchema = z.object({
  athleteId: z.string().nonempty(),
  eventId: z.string().nonempty(),
  disciplineId: z.string(),
  position: z.coerce.number().optional(),
  score: z.string().optional(),
  notes: z.string().optional(),
});



type TreeifiedError<T> = {
  errors: string[];
  properties?: {
    [K in keyof T]?: {
      errors: string[];
    };
  };
};


export type State = {
  errors?: TreeifiedError<z.infer<typeof ResultSchema>>;

  message: string;
};


export async function createResult(_prevState: State, formData: FormData): Promise<State> {
  const validatedFields = ResultSchema.safeParse(Object.fromEntries(formData.entries()));

  if (!validatedFields.success) {
    const treeifiedErrors = z.treeifyError(validatedFields.error);
    console.log('Validation Errors:', treeifiedErrors);
    return {
      errors: z.treeifyError(validatedFields.error),
      message: 'Validation Error: Failed to create result.',
    };
  }

  try {
    await prisma.result.create({
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
  revalidatePath(routes.results.list());
  redirect(routes.results.list());
}

