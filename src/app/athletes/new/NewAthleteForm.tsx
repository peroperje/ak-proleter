'use client'
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createAthlete } from '@/app/athletes/new/actions';

export default function NewAthleteForm() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [serverError, setServerError] = useState<string>('');

  async function handleFormAction(formData: FormData) {
    setIsSubmitting(true);
    setServerError('');

    try {
      // Extract form data
      const firstName = formData.get('firstName') as string;
      const lastName = formData.get('lastName') as string;
      const dateOfBirth = formData.get('dateOfBirth') as string;
      const gender = formData.get('gender') as 'male' | 'female';
      const email = formData.get('email') as string || undefined;
      const phone = formData.get('phone') as string || undefined;
      const address = formData.get('address') as string || undefined;
      const emergencyContact = formData.get('emergencyContact') as string || undefined;
      const category = formData.get('category') as string || undefined;
      const notes = formData.get('notes') as string || undefined;
      const photoUrl = formData.get('photoUrl') as string || undefined;

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
        categories: category ? [category] : [],
        notes,
        photoUrl
      };

      // Call server action to create athlete
      const result = await createAthlete(formattedData);

      if (result.error) {
        setServerError(result.error);
      } else {
        // Redirect to athletes page on success
        router.push('/athletes');
      }
    } catch (err) {
      setServerError('An unexpected error occurred. Please try again.');
      console.error('Error submitting form:', err);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form action={handleFormAction} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <div className="max-w-sm">
            <label htmlFor="firstName" className="block text-sm font-bold dark:text-white">
              First Name
            </label>
            <input
              id="firstName"
              name="firstName"
              type="text"
              className="block w-full rounded-lg border border-gray-200 px-4 py-3 text-sm focus:border-blue-500 focus:ring-blue-500 disabled:pointer-events-none disabled:opacity-50 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-400 dark:placeholder-neutral-500 dark:focus:ring-neutral-600"
              required
            />
          </div>
        </div>
        <div>
          <div className="max-w-sm">
            <label htmlFor="lastName" className="block text-sm font-bold dark:text-white">
              Last Name
            </label>
            <input
              id="lastName"
              name="lastName"
              type="text"
              className="block w-full rounded-lg border border-gray-200 px-4 py-3 text-sm focus:border-blue-500 focus:ring-blue-500 disabled:pointer-events-none disabled:opacity-50 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-400 dark:placeholder-neutral-500 dark:focus:ring-neutral-600"
              required
            />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <div className="max-w-sm">
            <label htmlFor="dateOfBirth" className="block text-sm font-bold dark:text-white">
              Date of Birth
            </label>
            <input
              id="dateOfBirth"
              name="dateOfBirth"
              type="date"
              className="block w-full rounded-lg border border-gray-200 px-4 py-3 text-sm focus:border-blue-500 focus:ring-blue-500 disabled:pointer-events-none disabled:opacity-50 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-400 dark:placeholder-neutral-500 dark:focus:ring-neutral-600"
              required
            />
          </div>
        </div>
        <div>
          <div>
            <label htmlFor="gender" className="block text-sm font-bold dark:text-white">
              Gender
            </label>
            <select
              id="gender"
              name="gender"
              className="mt-1 block w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 disabled:pointer-events-none disabled:opacity-50 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-400"
              required
            >
              <option value="male">Male</option>
              <option value="female">Female</option>
            </select>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <div className="max-w-sm">
            <label htmlFor="email" className="block text-sm font-bold dark:text-white">
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              className="block w-full rounded-lg border border-gray-200 px-4 py-3 text-sm focus:border-blue-500 focus:ring-blue-500 disabled:pointer-events-none disabled:opacity-50 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-400 dark:placeholder-neutral-500 dark:focus:ring-neutral-600"
            />
          </div>
        </div>
        <div>
          <div className="max-w-sm">
            <label htmlFor="phone" className="block text-sm font-bold dark:text-white">
              Phone
            </label>
            <input
              id="phone"
              name="phone"
              type="tel"
              className="block w-full rounded-lg border border-gray-200 px-4 py-3 text-sm focus:border-blue-500 focus:ring-blue-500 disabled:pointer-events-none disabled:opacity-50 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-400 dark:placeholder-neutral-500 dark:focus:ring-neutral-600"
            />
          </div>
        </div>
      </div>

      <div className="max-w-sm">
        <label htmlFor="address" className="block text-sm font-bold dark:text-white">
          Address
        </label>
        <input
          id="address"
          name="address"
          type="text"
          className="block w-full rounded-lg border border-gray-200 px-4 py-3 text-sm focus:border-blue-500 focus:ring-blue-500 disabled:pointer-events-none disabled:opacity-50 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-400 dark:placeholder-neutral-500 dark:focus:ring-neutral-600"
        />
      </div>

      <div className="max-w-sm">
        <label htmlFor="emergencyContact" className="block text-sm font-bold dark:text-white">
          Emergency Contact
        </label>
        <input
          id="emergencyContact"
          name="emergencyContact"
          type="text"
          className="block w-full rounded-lg border border-gray-200 px-4 py-3 text-sm focus:border-blue-500 focus:ring-blue-500 disabled:pointer-events-none disabled:opacity-50 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-400 dark:placeholder-neutral-500 dark:focus:ring-neutral-600"
        />
      </div>

      <div className="max-w-sm">
        <label htmlFor="category" className="block text-sm font-bold dark:text-white">
          Category
        </label>
        <input
          id="category"
          name="category"
          type="text"
          className="block w-full rounded-lg border border-gray-200 px-4 py-3 text-sm focus:border-blue-500 focus:ring-blue-500 disabled:pointer-events-none disabled:opacity-50 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-400 dark:placeholder-neutral-500 dark:focus:ring-neutral-600"
        />
      </div>

      <div>
        <label htmlFor="notes" className="block text-sm font-bold dark:text-white">
          Notes
        </label>
        <textarea
          id="notes"
          name="notes"
          className="mt-1 block w-full rounded-lg border border-gray-200 px-4 py-3 text-sm focus:border-blue-500 focus:ring-blue-500 disabled:pointer-events-none disabled:opacity-50 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-400 dark:placeholder-neutral-500 dark:focus:ring-neutral-600"
          rows={4}
        />
      </div>

      <div className="max-w-sm">
        <label htmlFor="photoUrl" className="block text-sm font-bold dark:text-white">
          Photo URL
        </label>
        <input
          id="photoUrl"
          name="photoUrl"
          type="url"
          className="block w-full rounded-lg border border-gray-200 px-4 py-3 text-sm focus:border-blue-500 focus:ring-blue-500 disabled:pointer-events-none disabled:opacity-50 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-400 dark:placeholder-neutral-500 dark:focus:ring-neutral-600"
        />
      </div>

      {serverError && (
        <div className="rounded-md bg-red-50 p-4 dark:bg-red-900/20">
          <div className="flex">
            <div className="text-sm text-red-700 dark:text-red-400">
              {serverError}
            </div>
          </div>
        </div>
      )}

      <div className="flex justify-end gap-3">
        <button
          type="button"
          onClick={() => router.push('/athletes')}
          className="inline-flex items-center justify-center gap-2 rounded-md border border-gray-200 px-4 py-2 text-sm font-semibold text-gray-500 hover:text-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 dark:border-neutral-700 dark:text-neutral-300 dark:hover:text-white"
          disabled={isSubmitting}
        >
          Cancel
        </button>
        <button
          type="submit"
          className="inline-flex items-center justify-center gap-2 rounded-md border border-transparent bg-blue-500 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800"
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Saving...' : 'Save Athlete'}
        </button>
      </div>
    </form>
  );
}
