import React, { Suspense } from 'react';
import { getDiscipline, GetDisciplineReturn } from '@/app/lib/actions/dicipline';

interface Props {
  children: (disciplines: GetDisciplineReturn) => React.ReactNode;
}
const DisciplineSelectionFieldProvider: React.FC<Props> = async ({children})=> {
  const disciplines = await getDiscipline();

  return (
    <Suspense fallback={'loading disciplines'}>
      {children(disciplines)}

    </Suspense>
  );
}

export default DisciplineSelectionFieldProvider;
