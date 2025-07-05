import Box from '@/app/views/Box';
import NewAthleteForm from './NewAthleteForm';

import PageLayout from '@/app/components/PageLayout';

export default function NewAthletePage() {
  return (
        <PageLayout
          title={'New Athlete'}
          currentPage="add athlete"

        >
          <Box title={'Please fill out the form below to add a new athlete.'}>
          <NewAthleteForm />
        </Box></PageLayout>
  );
}
