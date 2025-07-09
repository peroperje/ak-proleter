'use server';

import { revalidatePath } from 'next/cache';
import * as yup from 'yup';
import prisma from '@/app/lib/prisma';

// Define the type for the form data
export interface AthleteFormData {
  firstName: string;
  lastName: string;
  dateOfBirth: Date;
  gender: 'male' | 'female';
  email?: string;
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
  email: yup.string().email('Invalid email format').optional(),
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
 * 3. Converts the dateOfBirth string to Date object
 * 4. Returns a properly structured AthleteFormData object for use in athlete creation/update operations
 */
function getAthleteObjectFromFormData(payload: FormData): AthleteFormData {
  const firstName = payload.get('firstName') as string;
  const lastName = payload.get('lastName') as string;
  const dateOfBirth = payload.get('dateOfBirth') as string;
  const gender = payload.get('gender') as 'male' | 'female';
  const email = (payload.get('email') as string) || undefined;
  const phone = (payload.get('phone') as string) || undefined;
  const address = (payload.get('address') as string) || undefined;
  const notes = (payload.get('notes') as string) || undefined;
  const photoUrl = (payload.get('photoUrl') as string) || undefined;

  return {
    firstName,
    lastName,
    dateOfBirth: new Date(dateOfBirth),
    gender,
    email,
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

    // Create a new user with a profile
    await prisma.user.create({
      data: {
        name: `${formattedData.firstName} ${formattedData.lastName}`,
        email:
          formattedData.email ||
          `${formattedData.firstName.toLowerCase()}.${formattedData.lastName.toLowerCase()}@example.com`,
        passwordHash: 'placeholder', // In a real app, this would be properly hashed
        role: 'MEMBER',
        profile: {
          create: {
            dateOfBirth: new Date(formattedData.dateOfBirth),
            phoneNumber: formattedData.phone,
            address: formattedData.address,
            bio: formattedData.notes,
            avatarUrl: formattedData.photoUrl,
            gender: formattedData.gender,
            categoryId: category?.id || null,
          },
        },
      },
      include: {
        profile: {
          include: {
            category: true,
          },
        },
      },
    });
    revalidatePath('/athletes');
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
    // Update the existing user and profile
    await prisma.user.update({
      where: { id },
      data: {
        name: `${formattedData.firstName} ${formattedData.lastName}`,
        email:
          formattedData.email ||
          `${formattedData.firstName.toLowerCase()}.${formattedData.lastName.toLowerCase()}@example.com`,
        profile: {
          update: {
            dateOfBirth: new Date(formattedData.dateOfBirth),
            phoneNumber: formattedData.phone,
            address: formattedData.address,
            bio: formattedData.notes,
            avatarUrl: formattedData.photoUrl,
            gender: formattedData.gender,
            categoryId: category?.id || null,
          },
        },
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
    const user = await prisma.user.findUnique({
      where: { id },
      include: {
        profile: {
          include: {
            category: true,
          },
        },
      },
    });

    if (!user || !user.profile) {
      return null;
    }

    // Format the data to match AthleteFormData structure
    return {
      firstName: user.name.split(' ')[0],
      lastName: user.name.split(' ').slice(1).join(' '),
      dateOfBirth: new Date(user.profile.dateOfBirth as Date),
      gender: user.profile?.gender === 'male' ? 'male' : ('female' as const), // Default to male if not specified
      email: user.email,
      phone: user.profile.phoneNumber || undefined,
      address: user.profile.address || undefined,
      notes: user.profile.bio || undefined,
      photoUrl: user.profile.avatarUrl || undefined,
    };
  } catch (error) {
    console.error('Error fetching athlete:', error);
    return null;
  }
}
