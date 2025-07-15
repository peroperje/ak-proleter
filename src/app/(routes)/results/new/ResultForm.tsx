'use client';
import React, { PropsWithChildren, ReactElement, useActionState } from 'react';
import PageLayout from '@/app/components/PageLayout';
import { createResult, State } from '@/app/lib/actions/result';
import Button from '@/app/ui/button';
import Textarea from '@/app/ui/textarea';
import CloseBtn from '@/app/components/CloseBtn';
import Box from '@/app/components/Box';


const ResultForm:React.FC<PropsWithChildren> = ({   children }): ReactElement => {
  const initialState: State = { message: '' };
  const [state, dispatch, pending] = useActionState(createResult, initialState);


  return (
    <PageLayout title="Create Result" action={<CloseBtn />}>
      <Box title={'Create result'}>
        <form action={dispatch} className="flex flex-col gap-4">

          {
            children
          }
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

export default ResultForm;
