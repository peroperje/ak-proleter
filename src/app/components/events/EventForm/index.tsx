'use client';
// Define the type for the form data
import { useRouter } from 'next/navigation';
import clsx from 'clsx';
import LocationField from '@/app/components/events/EventForm/LocationField';
import { routes } from '@/app/lib/routes';
import Box from '@/app/components/Box';
import React, { useActionState, useEffect, useState } from 'react';
import { CalendarIcon } from '@/app/ui/icons';
import { toast } from 'react-toastify';

export interface EventFormData {
  title: string;
  description?: string;
  location: string;
  startDate: Date;
  endDate?: Date;
  type: 'COMPETITION' | 'TRAINING' | 'CAMP' | 'MEETING' | 'OTHER';
  categoryIds?: string[];
}

export type EventActionState = {
  errors: {
    [K in keyof EventFormData]?: string;
  };
  message: string;
  data?: EventFormData;
  status: 'success' | 'error' | 'validation' | 'new';
};

interface EventFormProps {
  action: (
    state: Awaited<EventActionState>,
    data: FormData,
  ) => Promise<EventActionState> | EventActionState;
  categories: { id: string; name: string }[];
  initialState: EventActionState;
}

const EventForm: React.FC<EventFormProps> = ({
  action,
  categories,
  initialState,
}) => {
  const router = useRouter();

  const [state, formAction, isSubmitting] = useActionState(
    action,
    initialState,
  );

  // Local state for interactive fields to provide immediate visual feedback
  const [selectedType, setSelectedType] = useState<string | undefined>(state.data?.type);
  const [selectedCategoryIds, setSelectedCategoryIds] = useState<string[]>(state.data?.categoryIds || []);
  const [categorySearch, setCategorySearch] = useState('');

  // Sync local state when state.data changes (e.g. after AI population or failed validation)
  useEffect(() => {
    if (state.data?.type) setSelectedType(state.data.type);
    if (state.data?.categoryIds) setSelectedCategoryIds(state.data.categoryIds);
  }, [state.data]);

  useEffect(() => {
    if (state.status === 'error') {
      document.documentElement.scrollTo({
        top: 0,
        behavior: 'smooth',
      });
    }
  }, [state.status]);

  useEffect(() => {
    if (state.status === 'success') {
      toast.success(state.message)
      router.push(routes.events.list())
    }
  }, [state.status, router, state.message]);

  const handleTypeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedType(e.target.value);
  };

  const handleCategoryChange = (id: string) => {
    setSelectedCategoryIds(prev =>
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const filteredCategories = categories.filter(cat =>
    cat.name.toLowerCase().includes(categorySearch.toLowerCase())
  );

  const deselectAllCategories = () => {
    setSelectedCategoryIds([]);
  };

  return (
    <Box
      icon={CalendarIcon}
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
              className={clsx(
                'block w-full rounded-lg border border-gray-200 px-4 py-3 text-sm focus:border-blue-500 focus:ring-blue-500 disabled:pointer-events-none disabled:opacity-50 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-400 dark:placeholder-neutral-500 dark:focus:ring-neutral-600',
                {
                  'border-red-500': !!state.errors.title,
                },
              )}
              required
            />
            {!!state.errors.title && (
              <p className='text-sm text-red-500 dark:text-neutral-400'>
                {state.errors.title}
              </p>
            )}
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
              className={clsx(
                'block w-full rounded-lg border border-gray-200 px-4 py-3 text-sm focus:border-blue-500 focus:ring-blue-500 disabled:pointer-events-none disabled:opacity-50 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-400 dark:placeholder-neutral-500 dark:focus:ring-neutral-600',
                {
                  'border-red-500': !!state.errors.description,
                },
              )}
              rows={4}
            />
            {!!state.errors.description && (
              <p className='text-sm text-red-500 dark:text-neutral-400'>
                {state.errors.description}
              </p>
            )}
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
              type='text'
              defaultValue={state.data?.location}
              className={clsx(
                'block w-full rounded-lg border border-gray-200 px-4 py-3 text-sm focus:border-blue-500 focus:ring-blue-500 disabled:pointer-events-none disabled:opacity-50 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-400 dark:placeholder-neutral-500 dark:focus:ring-neutral-600',
                {
                  'border-red-500': !!state.errors.location,
                },
              )}
              required
            />
            {!!state.errors.location && (
              <p className='text-sm text-red-500 dark:text-neutral-400'>
                {state.errors.location}
              </p>
            )}
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
              defaultValue={
                state.data?.startDate
                  ? state.data?.startDate.toLocaleString('sv-SE').slice(0, 16).replace(' ', 'T')
                  : undefined
              }
              className={clsx(
                'block w-full rounded-lg border border-gray-200 px-4 py-3 text-sm focus:border-blue-500 focus:ring-blue-500 disabled:pointer-events-none disabled:opacity-50 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-400 dark:placeholder-neutral-500 dark:focus:ring-neutral-600',
                {
                  'border-red-500': !!state.errors.startDate,
                },
              )}
              required
            />
            {!!state.errors.startDate && (
              <p className='text-sm text-red-500 dark:text-neutral-400'>
                {state.errors.startDate}
              </p>
            )}
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
              defaultValue={
                state.data?.endDate
                  ? state.data?.endDate.toLocaleString('sv-SE').slice(0, 16).replace(' ', 'T')
                  : undefined
              }
              className={clsx(
                'block w-full rounded-lg border border-gray-200 px-4 py-3 text-sm focus:border-blue-500 focus:ring-blue-500 disabled:pointer-events-none disabled:opacity-50 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-400 dark:placeholder-neutral-500 dark:focus:ring-neutral-600',
                {
                  'border-red-500': !!state.errors.endDate,
                },
              )}
            />
            {!!state.errors.endDate && (
              <p className='text-sm text-red-500 dark:text-neutral-400'>
                {state.errors.endDate}
              </p>
            )}
          </div>
        </div>

        <div className='grid grid-cols-1 md:grid-cols-2 gap-8'>
          {/* Event Type - Radio Buttons */}
          <div className='bg-gray-50 dark:bg-neutral-800/50 p-6 rounded-2xl border border-gray-100 dark:border-neutral-700/50'>
            <label
              className={clsx('block text-sm font-bold mb-4 dark:text-white', {
                'text-red-500': !!state.errors.type,
              })}
            >
              Event Type
            </label>
            <div className='grid grid-cols-1 sm:grid-cols-2 gap-3'>
              {[
                { value: 'COMPETITION', label: 'Competition' },
                { value: 'TRAINING', label: 'Training' },
                { value: 'CAMP', label: 'Camp' },
                { value: 'MEETING', label: 'Meeting' },
                { value: 'OTHER', label: 'Other' },
              ].map((eventType) => (
                <label
                  key={eventType.value}
                  className={clsx(
                    'relative flex items-center p-3 rounded-xl border cursor-pointer transition-all duration-200 group',
                    {
                      'bg-blue-50 border-blue-200 dark:bg-blue-900/20 dark:border-blue-800': selectedType === eventType.value,
                      'bg-white border-gray-200 hover:border-blue-300 dark:bg-neutral-900 dark:border-neutral-700 dark:hover:border-neutral-500': selectedType !== eventType.value,
                    }
                  )}
                >
                  <input
                    type='radio'
                    name='type'
                    value={eventType.value}
                    checked={selectedType === eventType.value}
                    onChange={handleTypeChange}
                    className='sr-only'
                    required
                  />
                  <div className={clsx(
                    'w-4 h-4 rounded-full border-2 mr-3 flex items-center justify-center transition-all',
                    {
                      'border-blue-500 bg-blue-500': selectedType === eventType.value,
                      'border-gray-300 dark:border-neutral-600': selectedType !== eventType.value,
                    }
                  )}>
                    {selectedType === eventType.value && (
                      <div className='w-1.5 h-1.5 rounded-full bg-white shadow-sm' />
                    )}
                  </div>
                  <span className={clsx(
                    'text-sm font-medium transition-colors',
                    {
                      'text-blue-700 dark:text-blue-300': selectedType === eventType.value,
                      'text-gray-600 dark:text-neutral-400': selectedType !== eventType.value,
                    }
                  )}>
                    {eventType.label}
                  </span>
                </label>
              ))}
            </div>
            {!!state.errors.type && (
              <p className='text-sm text-red-500 mt-2 dark:text-neutral-400'>
                {state.errors.type}
              </p>
            )}
          </div>

          {/* Categories - Checkboxes */}
          <div className='bg-gray-50 dark:bg-neutral-800/50 p-6 rounded-2xl border border-gray-100 dark:border-neutral-700/50 flex flex-col'>
            <div className="flex flex-col mb-4">
              <label
                className={clsx('block text-sm font-bold dark:text-white', {
                  'text-red-500': !!state.errors.categoryIds,
                })}
              >
                Categories
              </label>
              <div className="flex items-center justify-between mt-1">
                <button
                  type="button"
                  onClick={deselectAllCategories}
                  className="text-[11px] font-semibold text-blue-500 hover:text-blue-600 dark:text-blue-400 underline transition-colors"
                >
                  Deselect All
                </button>
                <p className='text-[10px] text-gray-400 italic'>
                  * No categories selected implies all categories
                </p>
              </div>
            </div>

            <div className="mb-4">
              <input
                type="text"
                placeholder="Search categories..."
                value={categorySearch}
                onChange={(e) => setCategorySearch(e.target.value)}
                className="block w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-blue-500 focus:ring-blue-500 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-400 dark:placeholder-neutral-500"
              />
            </div>

            <div className='grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar'>
              {filteredCategories.map((category) => {
                const isChecked = selectedCategoryIds.includes(category.id);
                return (
                  <label
                    key={category.id}
                    className={clsx(
                      'relative flex items-center p-3 rounded-xl border cursor-pointer transition-all duration-200 group',
                      {
                        'bg-blue-50 border-blue-200 dark:bg-blue-900/20 dark:border-blue-800': isChecked,
                        'bg-white border-gray-200 hover:border-blue-300 dark:bg-neutral-900 dark:border-neutral-700 dark:hover:border-neutral-500': !isChecked,
                      }
                    )}
                  >
                    <input
                      type='checkbox'
                      name='categoryIds'
                      value={category.id}
                      checked={isChecked}
                      onChange={() => handleCategoryChange(category.id)}
                      className='sr-only'
                    />
                    <div className={clsx(
                      'w-4 h-4 rounded border-2 mr-3 flex items-center justify-center transition-all',
                      {
                        'border-blue-500 bg-blue-500': isChecked,
                        'border-gray-300 dark:border-neutral-600': !isChecked,
                      }
                    )}>
                      {isChecked && (
                        <svg viewBox="0 0 24 24" className="w-3 h-3 text-white fill-current">
                          <path d="M20.285 2l-11.285 11.567-5.286-5.011-3.714 3.716 9 8.728 15-15.285z" />
                        </svg>
                      )}
                    </div>
                    <span className={clsx(
                      'text-sm font-medium transition-colors',
                      {
                        'text-blue-700 dark:text-blue-300': isChecked,
                        'text-gray-600 dark:text-neutral-400': !isChecked,
                      }
                    )}>
                      {category.name}
                    </span>
                  </label>
                );
              })}
              {filteredCategories.length === 0 && (
                <p className="col-span-full text-center text-sm text-gray-400 py-4 italic">
                  No categories found matching &quot;{categorySearch}&quot;
                </p>
              )}
            </div>
            {!!state.errors.categoryIds && (
              <p className='text-sm text-red-500 mt-2 dark:text-neutral-400'>
                {state.errors.categoryIds}
              </p>
            )}
          </div>
        </div>

        <div className='grid grid-cols-2 gap-4'>
          <button
            type='button'
            onClick={() => router.push(routes.events.list())}
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
    </Box>
  );
};

export default EventForm;
