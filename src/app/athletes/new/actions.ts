'use server'

import { revalidatePath } from 'next/cache';
import * as yup from 'yup';

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

/**
 * @deprecated
 * @param formData
 */
export async function createAthlete(formData: FormData) {
  console.log('this is Creating athlete:', formData);
  try {
    // Server-side validation
    await athleteSchema.validate(formData, { abortEarly: false });

    // Make API request to create athlete
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || ''}/api/athletes`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData),
    });

    if (!response.ok) {
      const errorData = await response.json();
      return { error: errorData.error || 'Failed to create athlete' };
    }

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
