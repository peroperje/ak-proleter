'use client'
// Define the type for the form data
import { useRouter } from 'next/navigation';
import clsx from 'clsx';
import LocationField from '@/app/components/events/EventForm/LocationField';
import { navItems } from '@/app/lib/routes';
import Box from '@/app/components/Box';
import { useActionState, useEffect } from 'react';
import { CreateEvent } from '@/app/lib/actions';


export interface EventFormData {
  title: string;
  description?: string;
  location: string;
  startDate: Date;
  endDate?: Date;
  type: 'COMPETITION' | 'TRAINING' | 'CAMP' | 'MEETING' | 'OTHER';
  categoryIds?: string[];
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
export default function EventForm({
  action,

  categories,
}: {
  action: CreateEvent;
  categories: { id: string; name: string }[];
}) {
  const router = useRouter();
  const initialState: EventActionState = {
    message: 'Please fill out the form below to create a new event.',
    errors: {},
    status: 'new' as const,
    data: undefined,
  };

  const [state, formAction, isSubmitting] = useActionState(
    action,
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
      <form action={formAction} className="space-y-6">
        <div className="grid grid-cols-1 gap-4">
          <div>
            <label
              htmlFor="title"
              className={clsx('block text-sm font-bold dark:text-white', {
                'text-red-500': !!state.errors.title
              })}
            >
              Title
            </label>
            <input
              id="title"
              name="title"
              type="text"
              defaultValue={state.data?.title}
              className={clsx(
                'block w-full rounded-lg border border-gray-200 px-4 py-3 text-sm focus:border-blue-500 focus:ring-blue-500 disabled:pointer-events-none disabled:opacity-50 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-400 dark:placeholder-neutral-500 dark:focus:ring-neutral-600',
                {
                  'border-red-500': !!state.errors.title
                }
              )}
              required
            />
            {!!state.errors.title && (
              <p className="text-sm text-red-500 dark:text-neutral-400">
                {state.errors.title}
              </p>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4">
          <div>
            <label
              htmlFor="description"
              className={clsx('block text-sm font-bold dark:text-white', {
                'text-red-500': !!state.errors.description
              })}
            >
              Description
            </label>
            <textarea
              id="description"
              name="description"
              defaultValue={state.data?.description}
              className={clsx(
                'block w-full rounded-lg border border-gray-200 px-4 py-3 text-sm focus:border-blue-500 focus:ring-blue-500 disabled:pointer-events-none disabled:opacity-50 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-400 dark:placeholder-neutral-500 dark:focus:ring-neutral-600',
                {
                  'border-red-500': !!state.errors.description
                }
              )}
              rows={4}
            />
            {!!state.errors.description && (
              <p className="text-sm text-red-500 dark:text-neutral-400">
                {state.errors.description}
              </p>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4">
          <div>
            <label
              htmlFor="location"
              className={clsx('block text-sm font-bold dark:text-white', {
                'text-red-500': !!state.errors.location
              })}
            >
              Location
            </label>
            <LocationField
              type="text"
              defaultValue={state.data?.location}
              className={clsx(
                'block w-full rounded-lg border border-gray-200 px-4 py-3 text-sm focus:border-blue-500 focus:ring-blue-500 disabled:pointer-events-none disabled:opacity-50 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-400 dark:placeholder-neutral-500 dark:focus:ring-neutral-600',
                {
                  'border-red-500': !!state.errors.location
                }
              )}
              required
            />
            {!!state.errors.location && (
              <p className="text-sm text-red-500 dark:text-neutral-400">
                {state.errors.location}
              </p>
            )}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label
              htmlFor="startDate"
              className={clsx('block text-sm font-bold dark:text-white', {
                'text-red-500': !!state.errors.startDate
              })}
            >
              Start Date
            </label>
            <input
              id="startDate"
              name="startDate"
              type="datetime-local"
              defaultValue={
                state.data?.startDate
                  ? state.data?.startDate.toISOString().slice(0, 16)
                  : undefined
              }
              className={clsx(
                'block w-full rounded-lg border border-gray-200 px-4 py-3 text-sm focus:border-blue-500 focus:ring-blue-500 disabled:pointer-events-none disabled:opacity-50 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-400 dark:placeholder-neutral-500 dark:focus:ring-neutral-600',
                {
                  'border-red-500': !!state.errors.startDate
                }
              )}
              required
            />
            {!!state.errors.startDate && (
              <p className="text-sm text-red-500 dark:text-neutral-400">
                {state.errors.startDate}
              </p>
            )}
          </div>
          <div>
            <label
              htmlFor="endDate"
              className={clsx('block text-sm font-bold dark:text-white', {
                'text-red-500': !!state.errors.endDate
              })}
            >
              End Date
            </label>
            <input
              id="endDate"
              name="endDate"
              type="datetime-local"
              defaultValue={
                state.data?.endDate
                  ? state.data?.endDate.toISOString().slice(0, 16)
                  : undefined
              }
              className={clsx(
                'block w-full rounded-lg border border-gray-200 px-4 py-3 text-sm focus:border-blue-500 focus:ring-blue-500 disabled:pointer-events-none disabled:opacity-50 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-400 dark:placeholder-neutral-500 dark:focus:ring-neutral-600',
                {
                  'border-red-500': !!state.errors.endDate
                }
              )}
            />
            {!!state.errors.endDate && (
              <p className="text-sm text-red-500 dark:text-neutral-400">
                {state.errors.endDate}
              </p>
            )}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label
              htmlFor="type"
              className={clsx('block text-sm font-bold dark:text-white', {
                'text-red-500': !!state.errors.type
              })}
            >
              Event Type
            </label>
            <select
              id="type"
              name="type"
              defaultValue={state.data?.type}
              className={clsx(
                'block w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-blue-500 focus:ring-blue-500 focus:outline-none disabled:pointer-events-none disabled:opacity-50 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-400',
                {
                  'border-red-500': !!state.errors.type
                }
              )}
              required
            >
              <option value="COMPETITION">Competition</option>
              <option value="TRAINING">Training</option>
              <option value="CAMP">Camp</option>
              <option value="MEETING">Meeting</option>
              <option value="OTHER">Other</option>
            </select>
            {!!state.errors.type && (
              <p className="text-sm text-red-500 dark:text-neutral-400">
                {state.errors.type}
              </p>
            )}
          </div>
          <div>
            <label
              htmlFor="categoryId"
              className={clsx('block text-sm font-bold dark:text-white', {
                'text-red-500': !!state.errors.categoryIds
              })}
            >
              Category
            </label>
            <select
              id="categoryId"
              name="categoryId"
              defaultValue={state.data?.categoryIds}
              className={clsx(
                'block w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-blue-500 focus:ring-blue-500 focus:outline-none disabled:pointer-events-none disabled:opacity-50 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-400',
                {
                  'border-red-500': !!state.errors.categoryIds
                }
              )}
              multiple

            >
              <option value="">Select a category</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
            {!!state.errors.categoryIds && (
              <p className="text-sm text-red-500 dark:text-neutral-400">
                {state.errors.categoryIds}
              </p>
            )}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <button
            type="button"
            onClick={() => router.push(navItems.events.href())}
            className="inline-flex items-center justify-center gap-2 rounded-md border border-gray-200 px-4 py-2 text-sm font-semibold text-gray-500 hover:text-gray-700 focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 focus:outline-none dark:border-neutral-700 dark:text-neutral-300 dark:hover:text-white"
            disabled={isSubmitting}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="inline-flex items-center justify-center gap-2 rounded-md border border-transparent bg-blue-500 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-600 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:outline-none dark:focus:ring-offset-gray-800"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Saving...' : 'Save Event'}
          </button>
        </div>
      </form>
    </Box>
  );
}
