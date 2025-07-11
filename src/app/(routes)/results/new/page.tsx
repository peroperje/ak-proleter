import React, { ReactElement, Suspense } from 'react';
import { Metadata } from 'next';
import prisma from '@/app/lib/prisma';
import ResultForm from './ResultForm';
import AthleteSelectionFiled from '@/app/(routes)/results/new/AthleteSelectionFiled';
import EventSelectionField from '@/app/(routes)/results/new/EventSelectionField';

export const metadata: Metadata = {
  title: 'Create Result',
};

const Page = async (): Promise<ReactElement> => {
  const disciplines = await prisma.discipline.findMany();

  return (

      <Suspense fallback={'Loading...'}>
        <ResultForm  disciplines={disciplines} >
          <AthleteSelectionFiled />
          <EventSelectionField />
        </ResultForm>
      </Suspense>

  );
};

export default Page;
