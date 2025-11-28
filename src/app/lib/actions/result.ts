'use server';

import { z } from 'zod';
import prisma from '@/app/lib/prisma';
import { revalidatePath } from 'next/cache';
import { routes } from '@/app/lib/routes';

const ResultSchema = z.object({
  athleteId: z.string().nonempty('Athlete is required'),
  eventId: z.string().nonempty('Event is required'),
  disciplineId: z.string().nonempty('Discipline is required'),
  position: z.coerce.number().optional(),
  score: z.string().optional(),
  notes: z.string().optional(),
});



export type State = {
  errors?: z.ZodFlattenedError<z.infer<typeof ResultSchema>>;
  message: string;
  data?: z.infer<typeof ResultSchema>;
  status: 'success' | 'error' | 'validation' | 'new';
};


export async function createResult(_prevState: State, formData: FormData): Promise<State> {
  const validatedFields = ResultSchema.safeParse(Object.fromEntries(formData.entries()));

  if (!validatedFields.success) {
    return {
      status: 'validation',
      errors: validatedFields.error.flatten(),
      message: 'Failed to create result, Please check your data.',
      data: Object.fromEntries(formData.entries()) as unknown as z.infer<typeof ResultSchema>
    };
  }

  try {
    await prisma.result.create({
      data: {
        ...validatedFields.data,
      },
    });
    revalidatePath(routes.results.new());
    revalidatePath(routes.results.list());

    return {
      status: 'success',
      message: 'Result created successfully',
    }
  } catch {
    return {
      status: 'error',
      message: 'Database Error: Failed to create result.',
    };
  }


}

