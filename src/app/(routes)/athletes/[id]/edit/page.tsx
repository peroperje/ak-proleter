import PageLayout from '@/app/components/PageLayout';
import { getAthleteById } from '@/app/lib/actions';
import { notFound } from 'next/navigation';
import EditForm from '@/app/(routes)/athletes/[id]/edit/EditForm';
import CloseBtn from '@/app/components/CloseBtn';

interface Props {
  params: Promise<{ id: string }>;
}

export default async function EditAthletePage(props: Props) {
  const params = await props.params;

  const user = await getAthleteById(params.id);
  if (!user) {
    notFound();
  }

  return (
    <PageLayout title={'Edit Athlete'}>
      <CloseBtn />

      <EditForm user={user} userId={params.id} />
    </PageLayout>
  );
}
