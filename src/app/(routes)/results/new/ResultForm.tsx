'use client';
import React, { ReactElement, useActionState } from 'react';
import PageLayout from '@/app/components/PageLayout';
import { createResult, State } from '@/app/lib/actions/result';
import Button from '@/app/ui/button';
import Select from '@/app/ui/select';
import InputField from '@/app/ui/input-field';
import Textarea from '@/app/ui/textarea';
import { Athlete, Discipline, Event } from '@prisma/client';
import CloseBtn from '@/app/components/CloseBtn';
import Box from '@/app/components/Box';

interface ResultFormProps {
  athletes: Athlete[];
  events: Event[];
  disciplines: Discipline[];
}

const ResultForm = ({ athletes, events, disciplines }: ResultFormProps): ReactElement => {
  const initialState: State = { message: '', errors: {} };
  const [state, dispatch] = useActionState(createResult, initialState);

  const athleteOptions = athletes.map(athlete => ({ value: athlete.id, label: athlete.name }));
  const eventOptions = events.map(event => ({ value: event.id, label: event.title }));
  const disciplineOptions = disciplines.map(discipline => ({ value: discipline.id, label: discipline.name }));

  return (
    <PageLayout title="Create Result" action={<CloseBtn />}>
      <Box title={'Create result'}>
        <form action={dispatch} className="flex flex-col gap-4">
          <Select name="athleteId" label="Athlete" options={athleteOptions} required />
          <Select name="eventId" label="Event" options={eventOptions} required />
          <Select name="disciplineId" label="Discipline" options={disciplineOptions} required />
          <InputField name="position" title="Position" type="number" />
          <InputField name="score" title="Score" />
          <Textarea name="notes" label="Notes" />
          <Button type="submit">Create Result</Button>
          {state.message && <p className="text-red-500">{state.message}</p>}
        </form>
      </Box>
    </PageLayout>
  );
};

export default ResultForm;
