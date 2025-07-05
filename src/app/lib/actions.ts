'use server'

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
  emergencyContact?: string;
  categories?: string[];
  notes?: string;
  photoUrl?: string;
}

// Define validation schema using yup
const athleteSchema = yup.object().shape({
  firstName: yup.string().required('First name is required').min(2, 'First name must be at least 2 characters long'),
  lastName: yup.string().required('Last name is required'),
  dateOfBirth: yup.date().required('Date of birth is required'),
  gender: yup.string().oneOf(['male', 'female'], 'Gender must be male or female').required('Gender is required'),
  email: yup.string().email('Invalid email format').optional(),
  phone: yup.string().optional(),
  address: yup.string().optional(),
  emergencyContact: yup.string().optional(),
  categories: yup.array().of(yup.string()).optional(),
  notes: yup.string().optional(),
  photoUrl: yup.string().url('Invalid URL format').optional(),
});

export type ActionState = {
  errors: {
    [K in keyof AthleteFormData]?: string;
  };

  message: string;
  data?:AthleteFormData
  status:'success'|'error'|'validation' | 'new';
};


export async function createAthlete(state:ActionState,payload
: FormData) {
  console.log('Creating athlete in libs:', payload
);
  // Extract form data
  const firstName = payload
.get('firstName') as string;
  const lastName = payload
.get('lastName') as string;
  const dateOfBirth = payload
.get('dateOfBirth') as string;
  const gender = payload
.get('gender') as 'male' | 'female';
  const email = (payload
.get('email') as string) || undefined;
  const phone = (payload
.get('phone') as string) || undefined;
  const address = (payload
.get('address') as string) || undefined;
  const emergencyContact =
    (payload
.get('emergencyContact') as string) || undefined;
  const categories = (payload
.get('categories') as string) || undefined;
  const notes = (payload
.get('notes') as string) || undefined;
  const photoUrl = (payload
.get('photoUrl') as string) || undefined;

  // Prepare data for submission
  const formattedData = {
    firstName,
    lastName,
    dateOfBirth: new Date(dateOfBirth),
    gender,
    email,
    phone,
    address,
    emergencyContact,
    categories: categories ? [categories] : undefined,
    notes,
    photoUrl,
  };
  console.log('Creating athlete in libs prepared:', formattedData);
  try {
    await athleteSchema.validate(formattedData, { abortEarly: false });
    const categoryIds = [];

    // Find or create categories
    if (formattedData.categories && formattedData.categories.length > 0) {
      for (const categoryName of formattedData.categories) {
        const category = await prisma.category.upsert({
          where: { name: categoryName },
          update: {},
          create: { name: categoryName },
        });
        categoryIds.push(category.id);
      }
    }
    // Create a new user with a profile
     await prisma.user.create({
      data: {
        name: `${formattedData.firstName} ${formattedData.lastName}`,
        email: formattedData.email || `${formattedData.firstName.toLowerCase()}.${formattedData.lastName.toLowerCase()}@example.com`,
        passwordHash: 'placeholder', // In a real app, this would be properly hashed
        role: 'MEMBER',
        profile: {
          create: {
            dateOfBirth: new Date(formattedData.dateOfBirth),
            phoneNumber: formattedData.phone,
            address: formattedData.address,
            bio: formattedData.notes,
            avatarUrl: formattedData.photoUrl,
            categoryId: categoryIds.length > 0 ? categoryIds[0] : null,
          }
        }
      },
      include: {
        profile: {
          include: {
            category: true
          }
        }
      }
    });
    revalidatePath('/athletes');
    return {
      errors: {} as ActionState['errors'],
      message: 'Athlete created successfully',
      status:'success' as const,
      data:formattedData,
    };

  } catch (error) {
    if (error instanceof yup.ValidationError) {
      return { errors:error.inner.reduce((acc, err) => {
          if (err.path) {
            acc[err.path as keyof ActionState['errors']] = err.message;
          }
          return acc;
        }, {} as ActionState['errors']),
        message: 'An unexpected error occurred',
        data:formattedData,
        status:'error' as const,
      };
    }

    return { errors:{} as ActionState['errors'], message: 'An unexpected error occurred. Please, check your data', data:formattedData, status:'error' as const };
  }
}

export async function getAthleteById(id: string): Promise<AthleteFormData | null> {
  try {
    const user = await prisma.user.findUnique({
      where: { id },
      include: {
        profile: {
          include: {
            category: true
          }
        }
      }
    });

    if (!user || !user.profile) {
      return null;
    }

    // Extract category name if it exists
    const categoryName = user.profile.category?.name;

    // Format the data to match AthleteFormData structure
    const athleteData: AthleteFormData = {
      firstName: user.name.split(' ')[0],
      lastName: user.name.split(' ').slice(1).join(' '),
      dateOfBirth: new Date(user.profile.dateOfBirth as Date),
      gender: user.profile.gender || 'male', // Default to male if not specified
      email: user.email,
      phone: user.profile.phoneNumber || undefined,
      address: user.profile.address || undefined,
      emergencyContact: user.profile.emergencyContact || undefined,
      categories: categoryName ? [categoryName] : undefined,
      notes: user.profile.bio || undefined,
      photoUrl: user.profile.avatarUrl || undefined,
    };

    return athleteData;
  } catch (error) {
    console.error('Error fetching athlete:', error);
    return null;
  }
}
