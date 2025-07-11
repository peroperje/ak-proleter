'use client';
import React, { PropsWithChildren, ReactElement, useActionState } from 'react';
import PageLayout from '@/app/components/PageLayout';
import { createResult, State } from '@/app/lib/actions/result';
import Button from '@/app/ui/button';
import Select from '@/app/ui/select';
import InputField from '@/app/ui/input-field';
import Textarea from '@/app/ui/textarea';
import {  Discipline } from '@prisma/client';
import CloseBtn from '@/app/components/CloseBtn';
import Box from '@/app/components/Box';

interface ResultFormProps {
  disciplines: Discipline[];

}

const ResultForm:React.FC<PropsWithChildren<ResultFormProps>> = ({  disciplines, children }): ReactElement => {
  const initialState: State = { message: '', errors: {} };
  const [state, dispatch, pending] = useActionState(createResult, initialState);

  const disciplineOptions = disciplines.map(discipline => ({ value: discipline.id, label: discipline.name }));

  return (
    <PageLayout title="Create Result" action={<CloseBtn />}>
      <Box title={'Create result'}>
        <form action={dispatch} className="flex flex-col gap-4">
          {
            children
          }

          <Select name="disciplineId" label="Discipline" options={disciplineOptions} required />
          <InputField name="position" title="Position" type="number" />
          <InputField name="score" title="Score" />
          <Textarea name="notes" label="Notes" />
          <Button type="submit" disabled={pending}
          >
            {pending ? 'Creating...' : 'Create Result'}

          </Button>
          {state.message && <p className="text-red-500">{state.message}</p>}
        </form>
      </Box>
    </PageLayout>
  );
};

export default ResultForm;
