'use client';
import React, {  ReactElement, useActionState } from 'react';
import PageLayout from '@/app/components/PageLayout';
import { createResult, State } from '@/app/lib/actions/result';
import Button from '@/app/ui/button';
import Textarea from '@/app/ui/textarea';
import CloseBtn from '@/app/components/CloseBtn';
import Box from '@/app/components/Box';
import { Athlete,  Event } from '@/app/lib/definitions';
import DisciplineScoreField from '@/app/components/results/Form/DisciplineSelectionField';
import AthleteField from '@/app/components/results/Form/AthleteSelectionFiled';
import EventField from '@/app/components/results/Form/EventSelectionField';
import { GetDisciplineReturn } from '@/app/lib/actions/dicipline';

interface Props {
  title?: string;
  disciplines:GetDisciplineReturn;
  athletes:Athlete[];
  events:Event[];
}
const AdminResultForm:React.FC<Props> = ({title='Create Result', disciplines,athletes,events}): ReactElement => {
  const initialState: State = { message: '' };
  const [state, dispatch, pending] = useActionState(createResult, initialState);

  return (
    <PageLayout title={title} action={<CloseBtn />}>
      <Box title={'Please enter result data'}>
        <form action={dispatch} className="flex flex-col gap-4">

          <DisciplineScoreField
            disciplines={disciplines}
            defaultDisciplineId={state.data?.disciplineId}
            defaultScore={state.data?.score}
            errors={state.errors?.properties?.disciplineId?.errors}
          />
          <AthleteField
            athletes={athletes}
            errors={state.errors?.properties?.athleteId?.errors}
            defaultAthleteId={state.data?.athleteId}
          />
          <EventField
            events={events}
            defaultEventId={state.data?.eventId}
            errors={state.errors?.properties?.eventId?.errors}
          />
          <Textarea name="notes" label="Notes" defaultValue={state.data?.notes} error={state.errors?.properties?.notes?.errors.join(' ')} />
          {state.message && <p className=" text-center text-red-500">{state.message}</p>}
          <Button type="submit" disabled={pending}
          >
            {pending ? 'Creating...' : 'Create Result'}

          </Button>

        </form>
      </Box>
    </PageLayout>
  );
};

export default AdminResultForm;
