'use client';
import Box from '@/app/components/Box';
import { ActionState, AthleteFormData, updateAthlete } from '@/app/lib/actions';
import { useActionState, useEffect } from 'react';
import AthleteForm from '@/app/components/athletes/AthleteForm';
import { routes } from '@/app/lib/routes';
import { UsersIcon } from '@/app/ui/icons';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';
import Loader from '@/app/ui/loader';

interface Props {
  athlete: AthleteFormData;
  userId: string;
}

export default function EditForm({ athlete, userId }: Props) {
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
      <AthleteForm
        state={state}
        formAction={formAction}
        isSubmitting={isSubmitting}
      />
      {isSubmitting && <Loader />}
    </Box>
  );
}
