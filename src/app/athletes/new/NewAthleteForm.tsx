'use client'
import { useRouter } from 'next/navigation';
import { createAthlete, ActionState } from '@/app/lib/actions';
import { useActionState } from 'react';
import clsx from 'clsx';


export default function NewAthleteForm() {
  const router = useRouter();
  /*const [isSubmitting, setIsSubmitting] = useState(false);
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
      const email = (formData.get('email') as string) || undefined;
      const phone = (formData.get('phone') as string) || undefined;
      const address = (formData.get('address') as string) || undefined;
      const emergencyContact =
        (formData.get('emergencyContact') as string) || undefined;
      const category = (formData.get('category') as string) || undefined;
      const notes = (formData.get('notes') as string) || undefined;
      const photoUrl = (formData.get('photoUrl') as string) || undefined;

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
        photoUrl,
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
  }*/
  const initialState:ActionState = { message: null, errors: {} };

const [state, formAction] = useActionState(createAthlete,initialState)
const serverError = '';
const isSubmitting = false;
console.log('state:', state);
  return (
    <form action={formAction} className='space-y-6'>
      <div className='grid grid-cols-1 gap-4'>
        <div>
          <label
            htmlFor='firstName'
            className={clsx('block text-sm font-bold dark:text-white', {
              'text-red-500': !!state.errors.firstName,
            })}
          >
            First Name
          </label>
          <input
            id='firstName'
            name='firstName'
            type='text'
            className={clsx('block w-full rounded-lg border border-gray-200 px-4 py-3 text-sm focus:border-blue-500 focus:ring-blue-500 disabled:pointer-events-none disabled:opacity-50 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-400 dark:placeholder-neutral-500 dark:focus:ring-neutral-600', {
              'border-red-500': !!state.errors.firstName,
            })}
            required
          />
          {
          !!state.errors.firstName &&  <p className="text-sm text-red-500 dark:text-neutral-400">
              {state.errors.firstName}
          </p>
          }
        </div>
        <div>
          <label
            htmlFor='lastName'
            className={clsx('block text-sm font-bold dark:text-white', {
              'text-red-500': !!state.errors.lastName,
            })}
          >
            Last Name
          </label>
          <input
            id='lastName'
            name='lastName'
            type='text'
            className={clsx('block w-full rounded-lg border border-gray-200 px-4 py-3 text-sm focus:border-blue-500 focus:ring-blue-500 disabled:pointer-events-none disabled:opacity-50 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-400 dark:placeholder-neutral-500 dark:focus:ring-neutral-600', {
              'border-red-500': !!state.errors.lastName,
            })}
            required
          />
          {
          !!state.errors.lastName &&  <p className="text-sm text-red-500 dark:text-neutral-400">
              {state.errors.lastName}
          </p>
          }
        </div>
      </div>

      <div className='grid grid-cols-1 gap-4'>
        <div>
          <label
            htmlFor='dateOfBirth'
            className={clsx('block text-sm font-bold dark:text-white', {
              'text-red-500': !!state.errors.dateOfBirth,
            })}
          >
            Date of Birth
          </label>
          <input
            id='dateOfBirth'
            name='dateOfBirth'
            type='date'
            className={clsx('block w-full rounded-lg border border-gray-200 px-4 py-3 text-sm focus:border-blue-500 focus:ring-blue-500 disabled:pointer-events-none disabled:opacity-50 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-400 dark:placeholder-neutral-500 dark:focus:ring-neutral-600', {
              'border-red-500': !!state.errors.dateOfBirth,
            })}
            required
          />
          {
          !!state.errors.dateOfBirth &&  <p className="text-sm text-red-500 dark:text-neutral-400">
              {state.errors.dateOfBirth}
          </p>
          }
        </div>
        <div>
          <label
            htmlFor='gender'
            className={clsx('block text-sm font-bold dark:text-white', {
              'text-red-500': !!state.errors.gender,
            })}
          >
            Gender
          </label>
          <select
            id='gender'
            name='gender'
            className={clsx('block w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-blue-500 focus:ring-blue-500 focus:outline-none disabled:pointer-events-none disabled:opacity-50 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-400', {
              'border-red-500': !!state.errors.gender,
            })}
            required
          >
            <option value='male'>Male</option>
            <option value='female'>Female</option>
          </select>
          {
          !!state.errors.gender &&  <p className="text-sm text-red-500 dark:text-neutral-400">
              {state.errors.gender}
          </p>
          }
        </div>
      </div>

      <div className='grid grid-cols-1 gap-4'>
        <div>
          <label
            htmlFor='email'
            className={clsx('block text-sm font-bold dark:text-white', {
              'text-red-500': !!state.errors.email,
            })}
          >
            Email
          </label>
          <input
            id='email'
            name='email'
            type='email'
            className={clsx('block w-full rounded-lg border border-gray-200 px-4 py-3 text-sm focus:border-blue-500 focus:ring-blue-500 disabled:pointer-events-none disabled:opacity-50 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-400 dark:placeholder-neutral-500 dark:focus:ring-neutral-600', {
              'border-red-500': !!state.errors.email,
            })}
          />
          {
          !!state.errors.email &&  <p className="text-sm text-red-500 dark:text-neutral-400">
              {state.errors.email}
          </p>
          }
        </div>
        <div>
          <label
            htmlFor='phone'
            className={clsx('block text-sm font-bold dark:text-white', {
              'text-red-500': !!state.errors.phone,
            })}
          >
            Phone
          </label>
          <input
            id='phone'
            name='phone'
            type='tel'
            className={clsx('block w-full rounded-lg border border-gray-200 px-4 py-3 text-sm focus:border-blue-500 focus:ring-blue-500 disabled:pointer-events-none disabled:opacity-50 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-400 dark:placeholder-neutral-500 dark:focus:ring-neutral-600', {
              'border-red-500': !!state.errors.phone,
            })}
          />
          {
          !!state.errors.phone &&  <p className="text-sm text-red-500 dark:text-neutral-400">
              {state.errors.phone}
          </p>
          }
        </div>
      </div>

      <div className='grid grid-cols-1 gap-4'>
        <div>
          <label
            htmlFor='address'
            className={clsx('block text-sm font-bold dark:text-white', {
              'text-red-500': !!state.errors.address,
            })}
          >
            Address
          </label>
          <input
            id='address'
            name='address'
            type='text'
            className={clsx('block w-full rounded-lg border border-gray-200 px-4 py-3 text-sm focus:border-blue-500 focus:ring-blue-500 disabled:pointer-events-none disabled:opacity-50 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-400 dark:placeholder-neutral-500 dark:focus:ring-neutral-600', {
              'border-red-500': !!state.errors.address,
            })}
          />
          {
          !!state.errors.address &&  <p className="text-sm text-red-500 dark:text-neutral-400">
              {state.errors.address}
          </p>
          }
        </div>
      </div>

      <div className='grid grid-cols-1 gap-4'>
        <div>
          <label
            htmlFor='emergencyContact'
            className={clsx('block text-sm font-bold dark:text-white', {
              'text-red-500': !!state.errors.emergencyContact,
            })}
          >
            Emergency Contact
          </label>
          <input
            id='emergencyContact'
            name='emergencyContact'
            type='text'
            className={clsx('block w-full rounded-lg border border-gray-200 px-4 py-3 text-sm focus:border-blue-500 focus:ring-blue-500 disabled:pointer-events-none disabled:opacity-50 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-400 dark:placeholder-neutral-500 dark:focus:ring-neutral-600', {
              'border-red-500': !!state.errors.emergencyContact,
            })}
          />
          {
          !!state.errors.emergencyContact &&  <p className="text-sm text-red-500 dark:text-neutral-400">
              {state.errors.emergencyContact}
          </p>
          }
        </div>
      </div>

      <div className='grid grid-cols-1 gap-4'>
        <div>
          <label
            htmlFor='category'
            className={clsx('block text-sm font-bold dark:text-white', {
              'text-red-500': !!state.errors.category,
            })}
          >
            Category
          </label>
          <input
            id='category'
            name='category'
            type='text'
            className={clsx('block w-full rounded-lg border border-gray-200 px-4 py-3 text-sm focus:border-blue-500 focus:ring-blue-500 disabled:pointer-events-none disabled:opacity-50 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-400 dark:placeholder-neutral-500 dark:focus:ring-neutral-600', {
              'border-red-500': !!state.errors.category,
            })}
          />
          {
          !!state.errors.category &&  <p className="text-sm text-red-500 dark:text-neutral-400">
              {state.errors.category}
          </p>
          }
        </div>
      </div>

      <div className='grid grid-cols-1 gap-4'>
        <div>
          <label
            htmlFor='notes'
            className={clsx('block text-sm font-bold dark:text-white', {
              'text-red-500': !!state.errors.notes,
            })}
          >
            Notes
          </label>
          <textarea
            id='notes'
            name='notes'
            className={clsx('block w-full rounded-lg border border-gray-200 px-4 py-3 text-sm focus:border-blue-500 focus:ring-blue-500 disabled:pointer-events-none disabled:opacity-50 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-400 dark:placeholder-neutral-500 dark:focus:ring-neutral-600', {
              'border-red-500': !!state.errors.notes,
            })}
            rows={4}
          />
          {
          !!state.errors.notes &&  <p className="text-sm text-red-500 dark:text-neutral-400">
              {state.errors.notes}
          </p>
          }
        </div>
      </div>

      <div className='grid grid-cols-1 gap-4'>
        <div>
          <label
            htmlFor='photoUrl'
            className={clsx('block text-sm font-bold dark:text-white', {
              'text-red-500': !!state.errors.photoUrl,
            })}
          >
            Photo URL
          </label>
          <input
            id='photoUrl'
            name='photoUrl'
            type='url'
            className={clsx('block w-full rounded-lg border border-gray-200 px-4 py-3 text-sm focus:border-blue-500 focus:ring-blue-500 disabled:pointer-events-none disabled:opacity-50 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-400 dark:placeholder-neutral-500 dark:focus:ring-neutral-600', {
              'border-red-500': !!state.errors.photoUrl,
            })}
          />
          {
          !!state.errors.photoUrl &&  <p className="text-sm text-red-500 dark:text-neutral-400">
              {state.errors.photoUrl}
          </p>
          }
        </div>
      </div>

      {serverError && (
        <div className='rounded-md bg-red-50 p-4 dark:bg-red-900/20'>
          <div className='flex'>
            <div className='text-sm text-red-700 dark:text-red-400'>
              {serverError}
            </div>
          </div>
        </div>
      )}

      <div className='flex justify-end gap-3'>
        <button
          type='button'
          onClick={() => router.push('/athletes')}
          className='inline-flex items-center justify-center gap-2 rounded-md border border-gray-200 px-4 py-2 text-sm font-semibold text-gray-500 hover:text-gray-700 focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 focus:outline-none dark:border-neutral-700 dark:text-neutral-300 dark:hover:text-white'
          disabled={isSubmitting}
        >
          Cancel
        </button>
        <button
          type='submit'
          className='inline-flex items-center justify-center gap-2 rounded-md border border-transparent bg-blue-500 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-600 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:outline-none dark:focus:ring-offset-gray-800'
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Saving...' : 'Save Athlete'}
        </button>
      </div>
    </form>
  );
}
