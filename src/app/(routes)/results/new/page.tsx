import React, { ReactElement, Suspense } from 'react';
import { Metadata } from 'next';
import prisma from '@/app/lib/prisma';
import ResultForm from './ResultForm';
import AthleteSelectionFiledContainer from '@/app/(routes)/results/new/AthleteSelectionFiled';

export const metadata: Metadata = {
  title: 'Create Result',
};

const Page = async (): Promise<ReactElement> => {
  const events = await prisma.event.findMany();
  const disciplines = await prisma.discipline.findMany();
  //const athletes = await prisma.athlete.findMany();

  return (
    <>
      <Suspense fallback={'Loading...'}>
        <ResultForm events={events} disciplines={disciplines} >
          <AthleteSelectionFiledContainer />
        </ResultForm>
      </Suspense>
    </>
  );
};

export default Page;
