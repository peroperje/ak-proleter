import React, { ReactElement } from 'react';
import { getDiscipline } from '@/app/lib/actions/dicipline';
import { getAthletes, getClosedEvents } from '@/app/lib/actions';
import AdminResultForm from '@/app/components/results/Form/AdminResultForm';

const EditPage: React.FC = async (): Promise<ReactElement>=> {
  const [disciplines, athletes, events] = await Promise.all([
    getDiscipline(),
    getAthletes(),
    getClosedEvents(),
  ]);
  return <AdminResultForm disciplines={disciplines} athletes={athletes} events={events} />;
}

export default EditPage;
