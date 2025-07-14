import React, { ReactElement, Suspense } from 'react';
import { Metadata } from 'next';
import ResultForm from './ResultForm';
import AthleteSelectionFiled from '@/app/(routes)/results/new/AthleteSelectionFiled';
import EventSelectionField from '@/app/(routes)/results/new/EventSelectionField';
import DisciplineSelectionField from '@/app/(routes)/results/new/DisciplineSelectionField';

export const metadata: Metadata = {
  title: 'Create Result',
};

const Page = async (): Promise<ReactElement> => {
  return (
    <ResultForm>
      <Suspense fallback={'load discipline'}>
        <DisciplineSelectionField />
      </Suspense>
      <Suspense fallback={'Loading athletes...'}>
        <AthleteSelectionFiled />
      </Suspense>
      <Suspense fallback={'Loading events...'}>
        <EventSelectionField />
      </Suspense>
    </ResultForm>
  );
};

export default Page;
