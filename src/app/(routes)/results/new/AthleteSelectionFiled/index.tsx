import React, { ReactElement, Suspense } from 'react';

import { getAthletes } from '@/app/lib/actions';
import SelectionBox from '@/app/(routes)/results/new/AthleteSelectionFiled/SelectionBox';

const AthleteSelectionFiledContainer: React.FC = (): ReactElement => {
  const athletes = getAthletes();

  return (
    <Suspense fallback={'Loading...'}>
      <SelectionBox athletes={athletes} />
    </Suspense>
  );
};
export default AthleteSelectionFiledContainer;
