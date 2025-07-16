import React, { ReactElement } from 'react';
import { Metadata } from 'next';
import AdminResultForm from './AdminResultForm';
import { getDiscipline } from '@/app/lib/actions/dicipline';
import { getAthletes, getClosedEvents } from '@/app/lib/actions';

export const metadata: Metadata = {
  title: 'Create Result',
};

const Page = async (): Promise<ReactElement> => {

  const [disciplines, athletes, events] = await Promise.all([
    getDiscipline(),
    getAthletes(),
    getClosedEvents(),
  ]);
  return (
    <AdminResultForm disciplines={disciplines} athletes={athletes} events={events} />
  );
};

export default Page;
