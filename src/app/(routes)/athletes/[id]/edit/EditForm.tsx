'use client';
import Box from '@/app/components/Box';
import { ActionState, AthleteFormData, updateAthlete } from '@/app/lib/actions';
import { useActionState, useEffect, useState } from 'react';
import AthleteForm from '@/app/components/athletes/AthleteForm';
import { routes } from '@/app/lib/routes';
import { UsersIcon } from '@/app/ui/icons';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';
import Loader from '@/app/ui/loader';
import { AIPopulationModal, TextAreaDefault as AIDefaultTextAreaPrompt } from '@/app/components/AiFormPopulator';

interface Props {
    athlete: AthleteFormData;
    userId: string;
  }


export default function EditForm({ athlete, userId }: Props) {
  const [aiFormData, setAiFormData] = useState<AthleteFormData | undefined>();
  const router = useRouter();
  const user = athlete;
  // Fetch athlete data when the component mounts

  const initialState: ActionState = {
    message: `Update ${user.firstName} ${user.lastName}  information below.`,
    errors: {},
    status: 'new' as const,
    data: user,
  };
  const [state, formAction, isSubmitting] = useActionState(
    updateAthlete.bind(null, userId),
    initialState,
  );

  useEffect(() => {
    if (state.status === 'error') {
      document.documentElement.scrollTo({
        top: 0,
        behavior: 'smooth',
      });
    }
  }, [state.status]);
  useEffect(() => {
    if (state.status === 'success') {
      toast.success(
        <div className={'flex gap-1 justify-center items-center'}>
          <span>The data for athlete {' '}</span>
          <Link
            className={'font-bold text-blue-50 underline'}
            href={routes.athletes.detail(userId)}
            passHref={true}
          >
            {user.firstName} {user.lastName}
          </Link>{' '}
          <span>has been updated successfully.{' '}</span>
        </div>,
      );
      router.push(routes.athletes.list());
    }
  }, [state.status, router, user.firstName, user.lastName, userId]);

  return (
    <Box
      icon={UsersIcon}
      title={state.message || initialState.message || ''}
      variants={((status) => {
        switch (status) {
          case 'error':
            return 'error';
          default:
            return undefined;
        }
      })(state.status)}
    >
      <AIPopulationModal<AthleteFormData>
        onDataExtracted={(data) => {
          setAiFormData({
            ...data,
            ...(data.dateOfBirth ? { dateOfBirth: new Date(data.dateOfBirth) } : {}),
          });
        }}
        defaultPrompt={`The athlete data is these fields: firstName (${athlete.firstName}), lastName (${athlete.lastName}), dateOfBirth (${athlete.dateOfBirth.toISOString().split('T')[0]} format), gender (${athlete.gender}), phone (${athlete.phone || ''}), address (${athlete.address || ''}), notes (${athlete.notes || ''})
        Extract athlete information from this text, update data that mentioned and return as JSON with updated values. Only include fields clearly mentioned.`}
        renderTextArea={(textProps) => {
          return (
            <AIDefaultTextAreaPrompt
              {...textProps}
              label={'Update athlete description:'}
              placeholder={`Example: Update athlete ${athlete.firstName} ${athlete.lastName}, phone changed to 555-0123, new address at 456 Oak Street, New York`}
            />
          );
        }}
      />
      <AthleteForm
        state={{
          ...state,
          ...{
            data: aiFormData ? {...state.data ,...aiFormData } : state.data,
          },
        }}
        formAction={formAction}
        isSubmitting={isSubmitting}
      />
      {isSubmitting && <Loader />}
    </Box>
  );
}
