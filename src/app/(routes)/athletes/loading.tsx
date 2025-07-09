import React from 'react';
import Box from '@/app/components/Box';
import PageLayout from '@/app/components/PageLayout';
import AthletesCardSkeleton from '@/app/components/athletes/AthletesCard/AthletesCardSkeleton';
import { UsersIcon } from '@/app/ui/icons';

export default function LoadingAthletesPage() {
  return (
    <PageLayout title='Athletes'>
      <Box icon={UsersIcon} title='Athlete List'>
        <div className='grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4'>
          {[...Array(8)].map((_, index) => (
            <AthletesCardSkeleton key={index} />
          ))}
        </div>
      </Box>
    </PageLayout>
  );
}
