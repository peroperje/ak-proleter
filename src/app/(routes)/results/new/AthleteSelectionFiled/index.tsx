import React, { Suspense } from 'react';

import { getAthletes } from '@/app/lib/actions';
import { Athlete } from '@/app/lib/definitions';


interface Props {
  children: (athletes: Athlete[]) => React.ReactNode;
}
const AthleteSelectionFiledProvider: React.FC<Props> = async ({children}) => {
  const athletes = await getAthletes();

  return (
    <Suspense fallback={'loading athletes'}>
      {
        children(athletes)
      }

    </Suspense>
  );
};
export default AthleteSelectionFiledProvider;
