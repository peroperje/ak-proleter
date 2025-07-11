import React from 'react';

import { getAthletes } from '@/app/lib/actions';
import SelectionBox from '@/app/(routes)/results/new/AthleteSelectionFiled/SelectionBox';


const AthleteSelectionFiledContainer: React.FC = async () => {
  const athletes = await getAthletes();

  return (
      <SelectionBox athletes={athletes} />
  );
};
export default AthleteSelectionFiledContainer;
