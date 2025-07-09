import PageLayout from '@/app/components/PageLayout';
import CloseBtn from '@/app/components/CloseBtn';
import FormContainer from '@/app/(routes)/events/new/FormContainer';

// Page component
export default function NewEventPage() {
  return (
    <PageLayout title={'New Event'}>
      <CloseBtn />
      <FormContainer />
    </PageLayout>
  );
}
