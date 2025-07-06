'use client';
import Box from '@/app/views/Box';
import AthleteForm from '@/app/components/athletes/AthleteForm';

import PageLayout from '@/app/components/PageLayout';
import { ActionState, createAthlete } from '@/app/lib/actions';
import { useActionState, useEffect } from 'react';
import { navItems } from '@/app/lib/routes';
import CloseBtn from '@/app/components/CloseBtn';

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
    if (state.status === 'success' || state.status === 'error') {
      document.documentElement.scrollTo({
        top: 0,
        behavior: 'smooth',
      });
    }
  }, [state.status]);

  return (
    <PageLayout title={'New Athlete'} currentPage='add athlete'>
      <CloseBtn />
      <Box
        icon={navItems.athletes.icon}
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
        <AthleteForm
          state={state}
          formAction={formAction}
          isSubmitting={isSubmitting}
        />
      </Box>
    </PageLayout>
  );
}
