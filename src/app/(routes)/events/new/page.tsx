import PageLayout from '@/app/components/PageLayout';
import CloseBtn from '@/app/components/CloseBtn';
import FormContainer from '@/app/(routes)/events/new/FormContainer';
import { CategoryProvider } from '@/app/components/events';

// Page component
export default function NewEventPage() {
  return (
    <PageLayout title={'New Event'}>
      <CloseBtn />
      <CategoryProvider>
        {
          (categories)=>(
            <FormContainer categories={categories} />
          )
        }
      </CategoryProvider>
    </PageLayout>
  );
}
