'use server';

import { revalidatePath } from 'next/cache';
import * as yup from 'yup';
import prisma from '@/app/lib/prisma';
import { Athlete } from '@/app/lib/definitions';
import { routes } from '@/app/lib/routes';

// Define the type for the form data
export interface AthleteFormData {
  firstName: string;
  lastName: string;
  dateOfBirth: Date;
  gender: 'male' | 'female';
  phone?: string;
  address?: string;
  notes?: string;
  photoUrl?: string;
}

const athleteSchema = yup.object().shape({
  firstName: yup
    .string()
    .required('First name is required')
    .min(2, 'First name must be at least 2 characters long'),
  lastName: yup.string().required('Last name is required'),
  dateOfBirth: yup.date().required('Date of birth is required'),
  gender: yup
    .string()
    .oneOf(['male', 'female'], 'Gender must be male or female')
    .required('Gender is required'),
  phone: yup.string().optional(),
  address: yup.string().optional(),
  notes: yup.string().optional(),
  photoUrl: yup.string().required(),
});

export type ActionState = {
  errors: {
    [K in keyof AthleteFormData]?: string;
  };

  message: string;
  data?: AthleteFormData;
  status: 'success' | 'error' | 'validation' | 'new';
};

/**
 * Converts FormData object to a structured AthleteFormData object.
 *
 * @param payload - The FormData object containing athlete information from a form submission
 * @returns An AthleteFormData object with properly typed and formatted fields
 *
 * This function:
 * 1. Extracts required fields (firstName, lastName, dateOfBirth, gender) from the FormData
 * 2. Extracts optional fields (email, phone, address, notes, photoUrl) from the FormData
 * 3. Converts the dateOfBirth string to a Date object
 * 4. Returns a properly structured AthleteFormData object for use in athlete creation/update operations
 */
function getAthleteObjectFromFormData(payload: FormData): AthleteFormData {
  const firstName = payload.get('firstName') as string;
  const lastName = payload.get('lastName') as string;
  const dateOfBirth = payload.get('dateOfBirth') as string;
  const gender = payload.get('gender') as 'male' | 'female';
  const phone = (payload.get('phone') as string) || undefined;
  const address = (payload.get('address') as string) || undefined;
  const notes = (payload.get('notes') as string) || undefined;
  const photoUrl = (payload.get('photoUrl') as string) || undefined;

  return {
    firstName,
    lastName,
    dateOfBirth: new Date(dateOfBirth),
    gender,
    phone,
    address,
    notes,
    photoUrl,
  };
}

/**
 * Determines the appropriate age category for an athlete based on their date of birth.
 *
 * @param dateOfBirth - The athlete's date of birth
 * @returns The matching category from the database based on the calculated age
 *
 * This function:
 * 1. Calculates the athlete's current age based on today's date
 * 2. Adjusts the age if the birthday didn't occur yet in the current year
 * 3. Queries the database to find the first category where:
 *    - The minimum age is less than or equal to the athlete's age
 *    - The maximum age is either greater than or equal to the athlete's age OR null (no upper limit)
 */
async function getCategoryByDateOfBirth(dateOfBirth: Date) {
  const today = new Date();
  let age = today.getFullYear() - dateOfBirth.getFullYear();
  // Adjust age if a birthday hasn't occurred this year
  if (
    today.getMonth() < dateOfBirth.getMonth() ||
    (today.getMonth() === dateOfBirth.getMonth() &&
      today.getDate() < dateOfBirth.getDate())
  ) {
    age--;
  }

  return await prisma.category.findFirst({
    where: {
      AND: [
        { minAge: { lte: age } },
        {
          OR: [{ maxAge: { gte: age } }, { maxAge: null }],
        },
      ],
    },
  });
}

export async function createAthlete(_state: ActionState, payload: FormData) {
  // Prepare data for submission
  const formattedData = getAthleteObjectFromFormData(payload);
  try {
    await athleteSchema.validate(formattedData, { abortEarly: false });

    const category = await getCategoryByDateOfBirth(formattedData.dateOfBirth);

    // Create only an athlete, not a user
    await prisma.athlete.create({
      data: {
        name: `${formattedData.firstName} ${formattedData.lastName}`,
        dateOfBirth: new Date(formattedData.dateOfBirth),
        phoneNumber: formattedData.phone,
        address: formattedData.address,
        bio: formattedData.notes,
        avatarUrl: formattedData.photoUrl,
        gender: formattedData.gender,
        categoryId: category?.id || null,
        openTrackId: null,
      },
      include: {
        category: true,
      },
    });
    revalidatePath(routes.athletes.list());
    return {
      errors: {} as ActionState['errors'],
      message: 'Athlete created successfully',
      status: 'success' as const,
      data: undefined,
    };
  } catch (error) {
    if (error instanceof yup.ValidationError) {
      return {
        errors: error.inner.reduce(
          (acc, err) => {
            if (err.path) {
              acc[err.path as keyof ActionState['errors']] = err.message;
            }
            return acc;
          },
          {} as ActionState['errors'],
        ),
        message: 'An unexpected error occurred',
        data: formattedData,
        status: 'error' as const,
      };
    }
    console.log('Error creating athlete:', error);
    return {
      errors: {} as ActionState['errors'],
      message: 'An unexpected error occurred. Please, check your data',
      data: formattedData,
      status: 'error' as const,
    };
  }
}

export async function updateAthlete(
  id: string,
  _state: ActionState,
  payload: FormData,
) {
  // Prepare data for submission
  const formattedData = getAthleteObjectFromFormData(
    payload,
  ) as AthleteFormData;

  try {
    await athleteSchema.validate(formattedData, { abortEarly: false });

    const category = await getCategoryByDateOfBirth(formattedData.dateOfBirth);
    // Update the existing user and athlete
    await prisma.athlete.update({
      where: { id },
      data: {
        name: `${formattedData.firstName} ${formattedData.lastName}`,
        dateOfBirth: new Date(formattedData.dateOfBirth),
        phoneNumber: formattedData.phone,
        address: formattedData.address,
        bio: formattedData.notes,
        avatarUrl: formattedData.photoUrl,
        gender: formattedData.gender,
        categoryId: category?.id || null,
      },
    });

    revalidatePath('/athletes');
    revalidatePath(`/athletes/${id}`);

    return {
      errors: {} as ActionState['errors'],
      message: 'Athlete updated successfully',
      status: 'success' as const,
      data: formattedData,
    };
  } catch (error) {
    if (error instanceof yup.ValidationError) {
      return {
        errors: error.inner.reduce(
          (acc, err) => {
            if (err.path) {
              acc[err.path as keyof ActionState['errors']] = err.message;
            }
            return acc;
          },
          {} as ActionState['errors'],
        ),
        message: 'An unexpected error occurred',
        data: formattedData,
        status: 'error' as const,
      };
    }

    return {
      errors: {} as ActionState['errors'],
      message: 'An unexpected error occurred. Please, check your data',
      data: formattedData,
      status: 'error' as const,
    };
  }
}

export async function getAthleteById(
  id: string,
): Promise<AthleteFormData | null> {
  try {
    const athlete = await prisma.athlete.findUnique({
      where: { id },
      include: {
        category: true,
      },
    });

    if (!athlete) {
      return null;
    }

    // Format the data to match AthleteFormData structure
    return {
      firstName: athlete.name.split(' ')[0],
      lastName: athlete.name.split(' ').slice(1).join(' '),
      dateOfBirth: new Date(athlete.dateOfBirth as Date),
      gender: athlete?.gender === 'male' ? 'male' : ('female' as const), // Default to male if not specified
      phone: athlete.phoneNumber || undefined,
      address: athlete.address || undefined,
      notes: athlete.bio || undefined,
      photoUrl: athlete.avatarUrl || undefined,
    };
  } catch (error) {
    console.error('Error fetching athlete:', error);
    return null;
  }
}

export async function getAthletes(): Promise<Athlete[]> {
  const athletes = await prisma.athlete.findMany({
    include: {
      user: true,
      category: true,
    },
  });
  return athletes.map((athlete: typeof athletes) => ({
    id: athlete.id,
    firstName: athlete.name.split(' ')[0],
    lastName: athlete.name.split(' ').slice(1).join(' '),
    dateOfBirth: athlete?.dateOfBirth || new Date(),
    gender: athlete?.gender === 'male' ? 'male' : 'female', // This information is not in the schema, defaulting to male
    email: athlete?.user?.email || '',
    phone: athlete?.phoneNumber || undefined,
    joinDate: athlete?.user?.createdAt,
    active: true, // This information is not in the schema, defaulting to true
    categories: athlete?.category ? [athlete.category.name] : [],
    address: athlete?.address,
    notes: athlete?.bio,
    photoUrl: athlete?.avatarUrl || undefined,
  }));
}
