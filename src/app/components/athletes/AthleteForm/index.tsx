'use client';
import { useRouter } from 'next/navigation';
import { ActionState } from '@/app/lib/actions';
import { routes } from '@/app/lib/routes';
import clsx from 'clsx';
import ProfileUrlInputField from '@/app/components/athletes/AthleteForm/ProfileUrlInputField';

interface AthleteFormProps {
  formAction: (payload: FormData) => void;
  isSubmitting: boolean;
  state: ActionState;
}

export default function AthleteForm({
  formAction,
  state,
  isSubmitting,
}: AthleteFormProps) {
  const router = useRouter();

  return (
    <form action={formAction} className='space-y-6'>
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
          <ProfileUrlInputField
            id='photoUrl'
            name='photoUrl'
            type='text'
            defaultValue={state.data?.photoUrl}
            className={clsx(
              'block w-full rounded-lg border border-gray-200 px-4 py-3 text-sm focus:border-blue-500 focus:ring-blue-500 disabled:pointer-events-none disabled:opacity-50 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-400 dark:placeholder-neutral-500 dark:focus:ring-neutral-600',
              {
                'border-red-500': !!state.errors.photoUrl,
              },
            )}
          />
          {!!state.errors.photoUrl && (
            <p className='text-sm text-red-500 dark:text-neutral-400'>
              {state.errors.photoUrl}
            </p>
          )}
        </div>
      </div>
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
            defaultValue={state.data?.firstName}
            className={clsx(
              'block w-full rounded-lg border border-gray-200 px-4 py-3 text-sm focus:border-blue-500 focus:ring-blue-500 disabled:pointer-events-none disabled:opacity-50 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-400 dark:placeholder-neutral-500 dark:focus:ring-neutral-600',
              {
                'border-red-500': !!state.errors.firstName,
              },
            )}
            required
          />
          {!!state.errors.firstName && (
            <p className='text-sm text-red-500 dark:text-neutral-400'>
              {state.errors.firstName}
            </p>
          )}
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
            defaultValue={state.data?.lastName}
            className={clsx(
              'block w-full rounded-lg border border-gray-200 px-4 py-3 text-sm focus:border-blue-500 focus:ring-blue-500 disabled:pointer-events-none disabled:opacity-50 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-400 dark:placeholder-neutral-500 dark:focus:ring-neutral-600',
              {
                'border-red-500': !!state.errors.lastName,
              },
            )}
            required
          />
          {!!state.errors.lastName && (
            <p className='text-sm text-red-500 dark:text-neutral-400'>
              {state.errors.lastName}
            </p>
          )}
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
            defaultValue={
              state.data?.dateOfBirth
                ? state.data?.dateOfBirth.toISOString().split('T')[0]
                : undefined
            }
            className={clsx(
              'block w-full rounded-lg border border-gray-200 px-4 py-3 text-sm focus:border-blue-500 focus:ring-blue-500 disabled:pointer-events-none disabled:opacity-50 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-400 dark:placeholder-neutral-500 dark:focus:ring-neutral-600',
              {
                'border-red-500': !!state.errors.dateOfBirth,
              },
            )}
            required
          />
          {!!state.errors.dateOfBirth && (
            <p className='text-sm text-red-500 dark:text-neutral-400'>
              {state.errors.dateOfBirth}
            </p>
          )}
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
            defaultValue={state.data?.gender}
            className={clsx(
              'block w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-blue-500 focus:ring-blue-500 focus:outline-none disabled:pointer-events-none disabled:opacity-50 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-400',
              {
                'border-red-500': !!state.errors.gender,
              },
            )}
            required
          >
            <option value='male'>Male</option>
            <option value='female'>Female</option>
          </select>
          {!!state.errors.gender && (
            <p className='text-sm text-red-500 dark:text-neutral-400'>
              {state.errors.gender}
            </p>
          )}
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
            defaultValue={state.data?.email}
            className={clsx(
              'block w-full rounded-lg border border-gray-200 px-4 py-3 text-sm focus:border-blue-500 focus:ring-blue-500 disabled:pointer-events-none disabled:opacity-50 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-400 dark:placeholder-neutral-500 dark:focus:ring-neutral-600',
              {
                'border-red-500': !!state.errors.email,
              },
            )}
          />
          {!!state.errors.email && (
            <p className='text-sm text-red-500 dark:text-neutral-400'>
              {state.errors.email}
            </p>
          )}
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
            defaultValue={state.data?.phone}
            className={clsx(
              'block w-full rounded-lg border border-gray-200 px-4 py-3 text-sm focus:border-blue-500 focus:ring-blue-500 disabled:pointer-events-none disabled:opacity-50 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-400 dark:placeholder-neutral-500 dark:focus:ring-neutral-600',
              {
                'border-red-500': !!state.errors.phone,
              },
            )}
          />
          {!!state.errors.phone && (
            <p className='text-sm text-red-500 dark:text-neutral-400'>
              {state.errors.phone}
            </p>
          )}
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
            defaultValue={state.data?.address}
            className={clsx(
              'block w-full rounded-lg border border-gray-200 px-4 py-3 text-sm focus:border-blue-500 focus:ring-blue-500 disabled:pointer-events-none disabled:opacity-50 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-400 dark:placeholder-neutral-500 dark:focus:ring-neutral-600',
              {
                'border-red-500': !!state.errors.address,
              },
            )}
          />
          {!!state.errors.address && (
            <p className='text-sm text-red-500 dark:text-neutral-400'>
              {state.errors.address}
            </p>
          )}
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
            defaultValue={state.data?.notes}
            className={clsx(
              'block w-full rounded-lg border border-gray-200 px-4 py-3 text-sm focus:border-blue-500 focus:ring-blue-500 disabled:pointer-events-none disabled:opacity-50 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-400 dark:placeholder-neutral-500 dark:focus:ring-neutral-600',
              {
                'border-red-500': !!state.errors.notes,
              },
            )}
            rows={4}
          />
          {!!state.errors.notes && (
            <p className='text-sm text-red-500 dark:text-neutral-400'>
              {state.errors.notes}
            </p>
          )}
        </div>
      </div>

      <div className='grid grid-cols-2 gap-4'>
        <button
          type='button'
          onClick={() => router.push(routes.athletes.list())}
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
