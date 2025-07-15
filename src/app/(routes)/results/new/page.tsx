import React, { ReactElement, Suspense } from 'react';
import { Metadata } from 'next';
import ResultForm from './ResultForm';
import AthleteSelectionFiled from '@/app/(routes)/results/new/AthleteSelectionFiled';
import EventSelectionField from '@/app/(routes)/results/new/EventSelectionField';
import DisciplineSelectionFieldProvider from '@/app/(routes)/results/new/DisciplineSelectionField';
import DisciplineField from '@/app/(routes)/results/new/DisciplineSelectionField/DisciplineField';
import AthleteField from '@/app/(routes)/results/new/AthleteSelectionFiled/AthleteField';
import EventField from '@/app/(routes)/results/new/EventSelectionField/EventField';

export const metadata: Metadata = {
  title: 'Create Result',
};

const Page =  (): ReactElement => {
  return (
    <ResultForm>
        <DisciplineSelectionFieldProvider >
          {
            (disciplines)=>(
              <DisciplineField disciplines={disciplines} />
            )
          }
        </DisciplineSelectionFieldProvider>

        <AthleteSelectionFiled >
          {
            (athletes)=>(<AthleteField athletes={athletes} />)
          }
        </AthleteSelectionFiled>

      <Suspense fallback={'Loading events...'}>
        <EventSelectionField >
          {
            (events)=>(<EventField events={events} />)
          }
        </EventSelectionField>
      </Suspense>
    </ResultForm>
  );
};

export default Page;
