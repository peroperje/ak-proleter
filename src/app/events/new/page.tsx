'use client';
import Box from '@/app/components/Box';
import PageLayout from '@/app/components/PageLayout';
import { useActionState, useEffect } from 'react';
import { navItems } from '@/app/lib/routes';
import CloseBtn from '@/app/components/CloseBtn';
import { useRouter } from 'next/navigation';
import clsx from 'clsx';
import { useState } from 'react';
import { createEvent } from '@/app/lib/actions/event';
import LocationField from '@/app/events/new/LocationField';

// Define the type for the form data
export interface EventFormData {
  title: string;
  description?: string;
  location: string;
  startDate: Date;
  endDate?: Date;
  type: 'COMPETITION' | 'TRAINING' | 'MEETING' | 'OTHER';
  categoryId?: string;
}

// Define the type for the action state
export type EventActionState = {
  errors: {
    [K in keyof EventFormData]?: string;
  };
  message: string;
  data?: EventFormData;
  status: 'success' | 'error' | 'validation' | 'new';
};

// EventForm component
function EventForm({ formAction, state, isSubmitting }: {
  formAction: (payload: FormData) => void;
  isSubmitting: boolean;
  state: EventActionState;
}) {
  const router = useRouter();
  // Hardcoded categories based on seed.ts
  const categories = [
    { id: '1', name: 'Senior' },
    { id: '2', name: 'U23' },
    { id: '3', name: 'Sprint' },
    { id: '4', name: 'Long Distance' },
    { id: '5', name: 'Throws' }
  ];

  return (
    <form action={formAction} className='space-y-6'>
      <div className='grid grid-cols-1 gap-4'>
        <div>
          <label
            htmlFor='title'
            className={clsx('block text-sm font-bold dark:text-white', {
              'text-red-500': !!state.errors.title,
            })}
          >
            Title
          </label>
          <input
            id='title'
            name='title'
            type='text'
            defaultValue={state.data?.title}
            className={clsx('block w-full rounded-lg border border-gray-200 px-4 py-3 text-sm focus:border-blue-500 focus:ring-blue-500 disabled:pointer-events-none disabled:opacity-50 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-400 dark:placeholder-neutral-500 dark:focus:ring-neutral-600', {
              'border-red-500': !!state.errors.title,
            })}
            required
          />
          {
            !!state.errors.title && <p className="text-sm text-red-500 dark:text-neutral-400">
              {state.errors.title}
            </p>
          }
        </div>
      </div>

      <div className='grid grid-cols-1 gap-4'>
        <div>
          <label
            htmlFor='description'
            className={clsx('block text-sm font-bold dark:text-white', {
              'text-red-500': !!state.errors.description,
            })}
          >
            Description
          </label>
          <textarea
            id='description'
            name='description'
            defaultValue={state.data?.description}
            className={clsx('block w-full rounded-lg border border-gray-200 px-4 py-3 text-sm focus:border-blue-500 focus:ring-blue-500 disabled:pointer-events-none disabled:opacity-50 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-400 dark:placeholder-neutral-500 dark:focus:ring-neutral-600', {
              'border-red-500': !!state.errors.description,
            })}
            rows={4}
          />
          {
            !!state.errors.description && <p className="text-sm text-red-500 dark:text-neutral-400">
              {state.errors.description}
            </p>
          }
        </div>
      </div>

      <div className='grid grid-cols-1 gap-4'>
        <div>
          <label
            htmlFor='location'
            className={clsx('block text-sm font-bold dark:text-white', {
              'text-red-500': !!state.errors.location,
            })}
          >
            Location
          </label>
          <LocationField
            id='location'
            name='location'
            type='text'
            defaultValue={state.data?.location}
            className={clsx('block w-full rounded-lg border border-gray-200 px-4 py-3 text-sm focus:border-blue-500 focus:ring-blue-500 disabled:pointer-events-none disabled:opacity-50 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-400 dark:placeholder-neutral-500 dark:focus:ring-neutral-600', {
              'border-red-500': !!state.errors.location,
            })}
            required
          />
          {
            !!state.errors.location && <p className="text-sm text-red-500 dark:text-neutral-400">
              {state.errors.location}
            </p>
          }
        </div>
      </div>

      <div className='grid grid-cols-2 gap-4'>
        <div>
          <label
            htmlFor='startDate'
            className={clsx('block text-sm font-bold dark:text-white', {
              'text-red-500': !!state.errors.startDate,
            })}
          >
            Start Date
          </label>
          <input
            id='startDate'
            name='startDate'
            type='datetime-local'
            defaultValue={state.data?.startDate ? state.data?.startDate.toISOString().slice(0, 16) : undefined}
            className={clsx('block w-full rounded-lg border border-gray-200 px-4 py-3 text-sm focus:border-blue-500 focus:ring-blue-500 disabled:pointer-events-none disabled:opacity-50 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-400 dark:placeholder-neutral-500 dark:focus:ring-neutral-600', {
              'border-red-500': !!state.errors.startDate,
            })}
            required
          />
          {
            !!state.errors.startDate && <p className="text-sm text-red-500 dark:text-neutral-400">
              {state.errors.startDate}
            </p>
          }
        </div>
        <div>
          <label
            htmlFor='endDate'
            className={clsx('block text-sm font-bold dark:text-white', {
              'text-red-500': !!state.errors.endDate,
            })}
          >
            End Date
          </label>
          <input
            id='endDate'
            name='endDate'
            type='datetime-local'
            defaultValue={state.data?.endDate ? state.data?.endDate.toISOString().slice(0, 16) : undefined}
            className={clsx('block w-full rounded-lg border border-gray-200 px-4 py-3 text-sm focus:border-blue-500 focus:ring-blue-500 disabled:pointer-events-none disabled:opacity-50 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-400 dark:placeholder-neutral-500 dark:focus:ring-neutral-600', {
              'border-red-500': !!state.errors.endDate,
            })}
          />
          {
            !!state.errors.endDate && <p className="text-sm text-red-500 dark:text-neutral-400">
              {state.errors.endDate}
            </p>
          }
        </div>
      </div>

      <div className='grid grid-cols-2 gap-4'>
        <div>
          <label
            htmlFor='type'
            className={clsx('block text-sm font-bold dark:text-white', {
              'text-red-500': !!state.errors.type,
            })}
          >
            Event Type
          </label>
          <select
            id='type'
            name='type'
            defaultValue={state.data?.type}
            className={clsx('block w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-blue-500 focus:ring-blue-500 focus:outline-none disabled:pointer-events-none disabled:opacity-50 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-400', {
              'border-red-500': !!state.errors.type,
            })}
            required
          >
            <option value='COMPETITION'>Competition</option>
            <option value='TRAINING'>Training</option>
            <option value='MEETING'>Meeting</option>
            <option value='OTHER'>Other</option>
          </select>
          {
            !!state.errors.type && <p className="text-sm text-red-500 dark:text-neutral-400">
              {state.errors.type}
            </p>
          }
        </div>
        <div>
          <label
            htmlFor='categoryId'
            className={clsx('block text-sm font-bold dark:text-white', {
              'text-red-500': !!state.errors.categoryId,
            })}
          >
            Category
          </label>
          <select
            id='categoryId'
            name='categoryId'
            defaultValue={state.data?.categoryId}
            className={clsx('block w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-blue-500 focus:ring-blue-500 focus:outline-none disabled:pointer-events-none disabled:opacity-50 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-400', {
              'border-red-500': !!state.errors.categoryId,
            })}
          >
            <option value=''>Select a category</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
          {
            !!state.errors.categoryId && <p className="text-sm text-red-500 dark:text-neutral-400">
              {state.errors.categoryId}
            </p>
          }
        </div>
      </div>

      <div className='grid grid-cols-2 gap-4'>
        <button
          type='button'
          onClick={() => router.push(navItems.events.href())}
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
          {isSubmitting ? 'Saving...' : 'Save Event'}
        </button>
      </div>
    </form>
  );
}

// Page component
export default function NewEventPage() {
  const initialState: EventActionState = {
    message: 'Please fill out the form below to create a new event.',
    errors: {},
    status: 'new' as const,
    data: undefined,
  };

  const [state, formAction, isSubmitting] = useActionState(
    createEvent,
    initialState,
  );

  useEffect(() => {
    if (state.status === 'success' || state.status === 'error') {
      document.documentElement.scrollTo({
        top: 0,
        behavior: 'smooth',
      });
    }
  }, [state.status]);

  return (
    <PageLayout title={'New Event'} currentPage='add event'>
      <CloseBtn />
      <Box
        icon={'events'}
        title={state.message || initialState.message || ''}
        variants={((status) => {
          switch (status) {
            case 'success':
              return 'success';
            case 'error':
              return 'error';
            default:
              return undefined;
          }
        })(state.status)}
      >
        <EventForm
          state={state}
          formAction={formAction}
          isSubmitting={isSubmitting}
        />
      </Box>
    </PageLayout>
  );
}
