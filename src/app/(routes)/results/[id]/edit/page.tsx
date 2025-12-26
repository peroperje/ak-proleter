import React, { ReactElement } from 'react';
import { getDiscipline } from '@/app/lib/actions/dicipline';
import { getAthletes, getClosedEvents } from '@/app/lib/actions';
import AdminResultForm from '@/app/components/results/Form/AdminResultForm';
import { getResultById, updateResult } from '@/app/lib/actions/result';
import { notFound } from 'next/navigation';

interface Props {
  params: Promise<{ id: string }>;
}

const EditPage = async (props: Props): Promise<ReactElement> => {
  const params = await props.params;
  const id = params.id;

  const [result, disciplines, athletes, events] = await Promise.all([
    getResultById(id),
    getDiscipline(),
    getAthletes(),
    getClosedEvents(),
  ]);

  if (!result) {
    notFound();
  }

  const updateResultWithId = updateResult.bind(null, id);

  return (
    <AdminResultForm
      action={updateResultWithId}
      title="Edit Result"
      disciplines={disciplines}
      athletes={athletes}
      events={events}
      initialData={result}
    />
  );
}

export default EditPage;
