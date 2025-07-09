import React from 'react';
import Box from '@/app/components/Box';
import PageLayout from '@/app/components/PageLayout';
import CloseBtn from '@/app/components/CloseBtn';

export default function LoadingAthletePage() {
  return (
    <PageLayout title={''} action={<CloseBtn />}>
      <div className='grid grid-cols-1 gap-6 md:grid-cols-2'>
        {/* Profile Information Skeleton */}
        <div className='md:col-span-1'>
          <Box icon={'running'} title='Profile Information'>
            <div className='mb-6 flex flex-col items-start md:flex-row'>
              <div className='mr-4 mb-4 md:mb-0'>
                {/* Avatar skeleton */}
                <div className='h-24 w-24 animate-pulse overflow-hidden rounded-full bg-gray-200 dark:bg-neutral-700'></div>
                <div className='mt-2 text-center'>
                  {/* Status badge skeleton */}
                  <div className='mx-auto h-5 w-16 animate-pulse rounded-full bg-gray-200 dark:bg-neutral-700'></div>
                </div>
              </div>
              <div className='flex flex-auto flex-col gap-3'>
                {/* Name skeleton */}
                <div className='h-8 w-48 animate-pulse rounded bg-gray-200 dark:bg-neutral-700'></div>

                <div className='flex flex-wrap gap-4'>
                  {/* Age skeleton */}
                  <div className='flex flex-auto flex-col gap-0'>
                    <div className='h-4 w-8 animate-pulse rounded bg-gray-200 dark:bg-neutral-700'></div>
                    <div className='mt-1 h-4 w-16 animate-pulse rounded bg-gray-200 dark:bg-neutral-700'></div>
                  </div>

                  {/* Gender skeleton */}
                  <div className='flex flex-auto flex-col gap-0'>
                    <div className='h-4 w-16 animate-pulse rounded bg-gray-200 dark:bg-neutral-700'></div>
                    <div className='mt-1 h-4 w-12 animate-pulse rounded bg-gray-200 dark:bg-neutral-700'></div>
                  </div>

                  {/* Date of Birth skeleton */}
                  <div className='flex flex-auto flex-col gap-0'>
                    <div className='h-4 w-24 animate-pulse rounded bg-gray-200 dark:bg-neutral-700'></div>
                    <div className='mt-1 h-4 w-32 animate-pulse rounded bg-gray-200 dark:bg-neutral-700'></div>
                  </div>

                  {/* Categories skeleton */}
                  <div className='flex flex-auto flex-col gap-0'>
                    <div className='h-4 w-20 animate-pulse rounded bg-gray-200 dark:bg-neutral-700'></div>
                    <div className='mt-1 h-4 w-28 animate-pulse rounded bg-gray-200 dark:bg-neutral-700'></div>
                  </div>
                </div>
              </div>
            </div>
          </Box>
        </div>

        {/* Contacts Skeleton */}
        <div className='md:col-span-1'>
          <Box title='Contacts' icon={'mail'}>
            <div className='flex flex-wrap justify-between gap-4 md:gap-6'>
              {/* Phone skeleton */}
              <div>
                <div className='h-4 w-12 animate-pulse rounded bg-gray-200 dark:bg-neutral-700'></div>
                <div className='mt-1 h-4 w-32 animate-pulse rounded bg-gray-200 dark:bg-neutral-700'></div>
              </div>

              {/* Email skeleton */}
              <div>
                <div className='h-4 w-12 animate-pulse rounded bg-gray-200 dark:bg-neutral-700'></div>
                <div className='mt-1 h-4 w-40 animate-pulse rounded bg-gray-200 dark:bg-neutral-700'></div>
              </div>

              {/* Address skeleton */}
              <div className='md:col-span-2'>
                <div className='h-4 w-16 animate-pulse rounded bg-gray-200 dark:bg-neutral-700'></div>
                <div className='mt-1 h-4 w-48 animate-pulse rounded bg-gray-200 dark:bg-neutral-700'></div>
              </div>
            </div>
          </Box>
        </div>
      </div>
    </PageLayout>
  );
}
