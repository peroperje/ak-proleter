import React from 'react';
import Box from '@/app/components/Box';
import PageLayout from '@/app/components/PageLayout';
import CloseBtn from '@/app/components/CloseBtn';
import { CalendarIcon } from '@/app/ui/icons';

export default function LoadingNewEventPage() {
  return (
    <PageLayout title={'New Event'} action={<CloseBtn />}>
      <Box icon={CalendarIcon} title='Loading form...'>
        <div className='animate-pulse'>
          <div className='space-y-6'>
            {/* Form fields skeleton */}
            {[...Array(10)].map((_, index) => (
              <div key={index} className='space-y-2'>
                <div className='h-4 w-1/4 rounded bg-gray-200 dark:bg-neutral-700'></div>
                <div className='h-10 rounded bg-gray-200 dark:bg-neutral-700'></div>
              </div>
            ))}

            {/* Date fields skeleton */}
            <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
              <div className='space-y-2'>
                <div className='h-4 w-1/4 rounded bg-gray-200 dark:bg-neutral-700'></div>
                <div className='h-10 rounded bg-gray-200 dark:bg-neutral-700'></div>
              </div>
              <div className='space-y-2'>
                <div className='h-4 w-1/4 rounded bg-gray-200 dark:bg-neutral-700'></div>
                <div className='h-10 rounded bg-gray-200 dark:bg-neutral-700'></div>
              </div>
            </div>

            {/* Categories skeleton */}
            <div className='space-y-2'>
              <div className='h-4 w-1/4 rounded bg-gray-200 dark:bg-neutral-700'></div>
              <div className='grid grid-cols-2 gap-2 md:grid-cols-3'>
                {[...Array(6)].map((_, index) => (
                  <div
                    key={index}
                    className='h-8 rounded bg-gray-200 dark:bg-neutral-700'
                  ></div>
                ))}
              </div>
            </div>

            {/* Button skeleton */}
            <div className='mt-6 flex justify-end'>
              <div className='h-10 w-32 rounded bg-gray-200 dark:bg-neutral-700'></div>
            </div>
          </div>
        </div>
      </Box>
    </PageLayout>
  );
}
