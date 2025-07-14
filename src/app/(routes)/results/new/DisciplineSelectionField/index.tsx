import React from 'react';
import SelectionBox from './SelectionBox';
import { getDiscipline } from '@/app/lib/actions/dicipline';

const DisciplineSelectionField: React.FC = async ()=> {
  const disciplines = await getDiscipline();

  return (
      <SelectionBox disciplines={disciplines} />
  );
}

export default DisciplineSelectionField;
