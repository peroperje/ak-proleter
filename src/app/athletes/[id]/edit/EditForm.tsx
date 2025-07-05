'use client';
import Box from '@/app/views/Box';
import { ActionState, AthleteFormData } from '@/app/lib/actions';
import { useActionState, useEffect } from 'react';
import AthleteForm from '@/app/components/athletes/AthleteForm';

interface Props {
  user: AthleteFormData;
}

export default  function EditForm({ user }: Props) {


  // Fetch athlete data when the component mounts

  const initialState: ActionState = {
    message: `Update ${user.firstName} ${user.lastName}  information below.`,
    errors: {},
    status: 'new' as const,
    data: user,
  };

  const [state, formAction, isSubmitting] = useActionState(
    async (formData: FormData) => {
      // Here you would implement the update athlete function
      // For now, we'll just return the initial state with the athlete data
      return {
        ...initialState,
        message: 'Update functionality not implemented yet',
        status: 'error' as const,
        data: user,
      };
    },
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
        <AthleteForm
          state={state}
          formAction={formAction}
          isSubmitting={isSubmitting}
        />
      </Box>

  );
}
