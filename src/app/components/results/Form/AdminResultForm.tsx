'use client';
import React, { ReactElement, useActionState, useEffect } from 'react';
import PageLayout from '@/app/components/PageLayout';
import { createResult, State } from '@/app/lib/actions/result';
import Button from '@/app/ui/button';
import Textarea from '@/app/ui/textarea';
import CloseBtn from '@/app/components/CloseBtn';
import Box from '@/app/components/Box';
import { Athlete, Event } from '@/app/lib/definitions';
import DisciplineScoreField from '@/app/components/results/Form/DisciplineSelectionField';
import AthleteField from '@/app/components/results/Form/AthleteSelectionFiled';
import EventField from '@/app/components/results/Form/EventSelectionField';
import { GetDisciplineReturn } from '@/app/lib/actions/dicipline';
import { toast } from 'react-toastify';
import { useRouter } from 'next/navigation';
import { routes } from '@/app/lib/routes';
import Loader from '@/app/ui/loader';

interface Props {
  action: (state: State, formData: FormData) => Promise<State>;
  title?: string;
  disciplines: GetDisciplineReturn;
  athletes: Athlete[];
  events: Event[];
  initialData?: any;
}
const AdminResultForm: React.FC<Props> = ({
  action,
  title = 'Create Result',
  disciplines,
  athletes,
  events,
  initialData,
}): ReactElement => {
  const router = useRouter();
  const initialState: State = {
    message: initialData ? '' : 'Please enter result data',
    status: 'new',
    data: initialData
  };
  const [state, dispatch, pending] = useActionState(action, initialState);

  const isEdit = !!initialData;

  useEffect(() => {
    if (state.status === 'success') {
      router.push(routes.results.list());
      toast.success(state.message);
    }
  }, [state.status, state.message, router]);

  useEffect(() => {
    if (state.status === 'error' || state.status === 'validation') {
      document.documentElement.scrollTo({
        top: 0,
        behavior: 'smooth',
      });
    }
  }, [state.status, router]);

  return (
    <PageLayout title={title} action={<CloseBtn />}>
      <Box
        title={state.message || (isEdit ? 'Update result data' : 'Please enter result data')}
        variants={((status) => {
          switch (status) {
            case 'success':
              return 'success';
            case 'error':
              return 'error';
            case 'validation':
              return 'error';
            default:
              return undefined;
          }
        })(state.status)}
      >
        <form action={dispatch} className='flex flex-col gap-4'>
          <DisciplineScoreField
            disciplines={disciplines}
            defaultDisciplineId={state.data?.disciplineId}
            defaultScore={state.data?.score}
            errors={state.errors?.fieldErrors?.disciplineId}
          />
          <AthleteField
            athletes={athletes}
            errors={state.errors?.fieldErrors?.athleteId}
            defaultAthleteId={state.data?.athleteId}
          />
          <EventField
            events={events}
            defaultEventId={state.data?.eventId}
            errors={state.errors?.fieldErrors?.eventId}
          />
          <Textarea
            name='notes'
            label='Notes'
            defaultValue={state.data?.notes}
            error={state.errors?.fieldErrors?.notes?.join(' ')}
          />
          <Button type='submit' disabled={pending}>
            {pending
              ? (isEdit ? 'Updating...' : 'Creating...')
              : (isEdit ? 'Update Result' : 'Create Result')}
          </Button>
        </form>
        {pending && <Loader />}
      </Box>
    </PageLayout>
  );
};

export default AdminResultForm;
