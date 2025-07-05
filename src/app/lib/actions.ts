'use server'

import { revalidatePath } from 'next/cache';
import * as yup from 'yup';
import prisma from '@/app/lib/prisma';

// Define the type for the form data
interface AthleteFormData {
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
  firstName: yup.string().required('First name is required'),
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

export async function createAthlete(formData: AthleteFormData) {
  console.log('Creating athlete:', formData);
  try {
    // Server-side validation
    await athleteSchema.validate(formData, { abortEarly: false });

    // Validate required fields
    if (!formData.firstName || !formData.lastName || !formData.dateOfBirth || !formData.gender) {
      return { error: 'Missing required fields' };
    }

    // Find or create categories
    const categoryIds = [];
    if (formData.categories && formData.categories.length > 0) {
      for (const categoryName of formData.categories) {
        const category = await prisma.category.upsert({
          where: { name: categoryName },
          update: {},
          create: { name: categoryName },
        });
        categoryIds.push(category.id);
      }
    }

    // Create a new user with a profile
    const newUser = await prisma.user.create({
      data: {
        name: `${formData.firstName} ${formData.lastName}`,
        email: formData.email || `${formData.firstName.toLowerCase()}.${formData.lastName.toLowerCase()}@example.com`,
        passwordHash: 'placeholder', // In a real app, this would be properly hashed
        role: 'MEMBER',
        profile: {
          create: {
            dateOfBirth: new Date(formData.dateOfBirth),
            phoneNumber: formData.phone,
            address: formData.address,
            bio: formData.notes,
            avatarUrl: formData.photoUrl,
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

    // Transform the user data to match the Athlete interface
    const newAthlete = {
      id: newUser.id,
      firstName: formData.firstName,
      lastName: formData.lastName,
      dateOfBirth: new Date(formData.dateOfBirth),
      gender: formData.gender,
      email: newUser.email,
      phone: newUser.profile?.phoneNumber || undefined,
      joinDate: newUser.createdAt,
      active: true,
      categories: categoryIds.length > 0 ? formData.categories : [],
      notes: formData.notes,
      photoUrl: formData.photoUrl,
      address: formData.address,
      emergencyContact: formData.emergencyContact,
    };

    // Revalidate the athletes page to show the new athlete
    revalidatePath('/athletes');

    // Return success
    return { success: true };
  } catch (error) {
    console.error('Error creating athlete:', error);

    if (error instanceof yup.ValidationError) {
      // Return validation errors
      return {
        error: 'Validation failed',
        validationErrors: error.inner.reduce((acc, err) => {
          if (err.path) {
            acc[err.path] = err.message;
          }
          return acc;
        }, {} as Record<string, string>)
      };
    }

    return { error: 'An unexpected error occurred' };
  }
}
