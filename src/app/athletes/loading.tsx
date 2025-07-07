import React from 'react';
import Box from '@/app/components/Box';
import PageLayout from '@/app/components/PageLayout';
import { navItems } from '@/app/lib/routes';
import AthletesCardSkeleton from '@/app/components/athletes/AthletesCard/AthletesCardSkeleton';

export default function LoadingAthletesPage() {
  return (
    <PageLayout
      title="Athletes"
      currentPage="athletes"
    >
      <Box
        icon={navItems.athletes.icon}
        title="Athlete List"
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {[...Array(8)].map((_, index) => (
            <AthletesCardSkeleton key={index} />
          ))}
        </div>
      </Box>
    </PageLayout>
  );
}
