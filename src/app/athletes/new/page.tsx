'use client';
import Box from '@/app/views/Box';
import NewAthleteForm from './NewAthleteForm';

import PageLayout from '@/app/components/PageLayout';
import { ActionState, createAthlete } from '@/app/lib/actions';
import { useActionState, useEffect } from 'react';

export default function NewAthletePage() {
  const initialState: ActionState = {
    message: 'Please fill out the form below to add a new athlete.',
    errors: {},
    status: 'new' as const,
    data: undefined,
  };

  const [state, formAction, isSubmitting] = useActionState(
    createAthlete,
    initialState,
  );

  useEffect(() => {
    console.log(state.status);
    if (state.status === 'success' || state.status === 'error') {
      console.log(state.status);
      document.documentElement.scrollTo({
        top: 0,
        behavior: 'smooth',
      });
    }
  }, [state.status]);

  return (
    <PageLayout title={'New Athlete'} currentPage='add athlete'>
      <Box
        title={state.message || initialState.message || ''}
        variants={((status) => {
          switch (status) {
            case 'success':
              return 'success';
            case 'error':
              return 'error';
            default:
              return undefined;
          }
        })(state.status)}
      >
        <NewAthleteForm
          state={state}
          formAction={formAction}
          isSubmitting={isSubmitting}
        />
      </Box>
    </PageLayout>
  );
}
