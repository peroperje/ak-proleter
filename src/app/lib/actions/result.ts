'use server';

import { z } from 'zod';
import prisma from '@/app/lib/prisma';
import { revalidatePath } from 'next/cache';
import { routes } from '@/app/lib/routes';
import { redirect } from 'next/navigation';

const ResultSchema = z.object({
  athleteId: z.string().nonempty('Athlete is required'),
  eventId: z.string().nonempty('Event is required'),
  disciplineId: z.string().nonempty('Discipline is required'),
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
  data?: z.infer<typeof ResultSchema>;
};


export async function createResult(_prevState: State, formData: FormData): Promise<State> {
  const validatedFields = ResultSchema.safeParse(Object.fromEntries(formData.entries()));

  if (!validatedFields.success) {
    return {
      errors: z.treeifyError(validatedFields.error),
      message: 'Failed to create result, Please check your data.',
      data:Object.fromEntries(formData.entries()) as unknown as z.infer<typeof ResultSchema>
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

