'use client';
import React, { useActionState, useEffect, useState } from 'react';
import AthleteForm from '@/app/components/athletes/AthleteForm';
import Box from '@/app/components/Box';
import PageLayout from '@/app/components/PageLayout';
import { ActionState, AthleteFormData, createAthlete } from '@/app/lib/actions';
import { UserPlusIcon } from '@/app/ui/icons';
import CloseBtn from '@/app/components/CloseBtn';
import { useRouter } from 'next/navigation';
import { routes } from '@/app/lib/routes';
import { toast } from 'react-toastify';
import Loader from '@/app/ui/loader';

import { AIPopulationModal ,TextAreaDefault as AIDefaultTextAreaPrompt } from '@/app/components/AiFormPopulator';

export default function NewAthletePage() {
  const router = useRouter();

  const [aiFormData, setAiFormData] = useState<AthleteFormData | undefined>();

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
    if (state.status === 'error') {
      document.documentElement.scrollTo({
        top: 0,
        behavior: 'smooth',
      });
    } else if (state.status === 'success') {
      toast.success(state.message);
      router.push(routes.athletes.list());
    }
  }, [state.status, router, state.message]);

  return (
    <PageLayout title={'New Athlete'}>
      <CloseBtn />


      <Box
        icon={UserPlusIcon}
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

        <AIPopulationModal<AthleteFormData>
          onDataExtracted={(data) => {
          setAiFormData({ ...data, ...{
              dateOfBirth: new Date(data.dateOfBirth),
            } });
        }}
          defaultPrompt={
            'Extract athlete information from this text and return as JSON with these fields: firstName, lastName, dateOfBirth (YYYY-MM-DD format), gender (male/female), phone, address, notes. Only include fields clearly mentioned.'
          }
          renderTextArea={(textProps) => {
            return (
              <AIDefaultTextAreaPrompt
                {...textProps}
                label={'Enter description of athlete:'}
                placeholder='Example: Create athlete Maria Rodriguez, female, born March 15 1992, phone 555-0123, lives at 456 Oak Street, New York'
              />
            );
          }}
        />

        <AthleteForm
          state={{
            ...state,
            ...aiFormData?{
              data: aiFormData,
            }:{}
        }}
          formAction={formAction}
          isSubmitting={isSubmitting}
        />
        {isSubmitting && <Loader />}
      </Box>
    </PageLayout>
  );
}
