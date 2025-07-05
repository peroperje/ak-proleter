'use client';
import Box from '@/app/views/Box';
import { ActionState, AthleteFormData, updateAthlete } from '@/app/lib/actions';
import { useActionState, useEffect } from 'react';
import AthleteForm from '@/app/components/athletes/AthleteForm';
import { navItems } from '@/app/lib/routes';

interface Props {
  user: AthleteFormData;
  userId: string;
}

export default function EditForm({ user, userId }: Props) {


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
    if (state.status === 'success' || state.status === 'error') {
      document.documentElement.scrollTo({
        top: 0,
        behavior: 'smooth',
      });
    }
  }, [state.status]);

  return (

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

  );
}
