import PageLayout from '@/app/components/PageLayout';
import { getAthleteById } from '@/app/lib/actions';
import { notFound } from 'next/navigation';
import EditForm from '@/app/(routes)/athletes/[id]/edit/EditForm';
import CloseBtn from '@/app/components/CloseBtn';
import { Suspense, use } from 'react';

interface Props {
  params: Promise<{ id: string }>;
}

export default  function EditAthletePage(props: Props) {
  const params = use (props.params);

  const athlete =  use(getAthleteById(params.id));
  if (!athlete) {
    notFound();
  }

  return (
    <PageLayout title={'Edit Athlete'}>
      <CloseBtn />

      <Suspense fallback={'Loading athlete data...'}>
        <EditForm athlete={athlete} userId={params.id} />
      </Suspense>
    </PageLayout>
  );
}
