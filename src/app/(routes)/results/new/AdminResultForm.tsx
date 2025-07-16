'use client';
import React, {  ReactElement, useActionState } from 'react';
import PageLayout from '@/app/components/PageLayout';
import { createResult, State } from '@/app/lib/actions/result';
import Button from '@/app/ui/button';
import Textarea from '@/app/ui/textarea';
import CloseBtn from '@/app/components/CloseBtn';
import Box from '@/app/components/Box';
import { Athlete,  Event } from '@/app/lib/definitions';
import DisciplineField from '@/app/(routes)/results/new/DisciplineSelectionField';
import AthleteField from '@/app/(routes)/results/new/AthleteSelectionFiled';
import EventField from '@/app/(routes)/results/new/EventSelectionField';
import { GetDisciplineReturn } from '@/app/lib/actions/dicipline';

interface Props {
  disciplines:GetDisciplineReturn;
  athletes:Athlete[];
  events:Event[];
}
const AdminResultForm:React.FC<Props> = ({disciplines,athletes,events}): ReactElement => {
  const initialState: State = { message: '' };
  const [state, dispatch, pending] = useActionState(createResult, initialState);

  console.log('Error in form',state.errors?.properties?.disciplineId?.errors);
  return (
    <PageLayout title="Create Result" action={<CloseBtn />}>
      <Box title={'Create result'}>
        <form action={dispatch} className="flex flex-col gap-4">

          <DisciplineField
            disciplines={disciplines}
            errors={state.errors?.properties?.disciplineId?.errors}
          />
          <AthleteField
            athletes={athletes}
            errors={state.errors?.properties?.athleteId?.errors}
          />
          <EventField events={events} />
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

export default AdminResultForm;
