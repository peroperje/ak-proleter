import Box from '@/app/views/Box';
import NewAthleteForm from './NewAthleteForm';
import Logo from '@/app/components/Logo';

export default function NewAthletePage() {
  return (
    <main className="flex items-center justify-center md:h-screen bg-gray-50 dark:bg-neutral-800">
      <div className="relative mx-auto flex w-full max-w-[800px] flex-col space-y-2.5 p-4 md:-mt-32">
        <div className="flex justify-center mb-4">
          <Logo />
        </div>

        <Box title={'Add New Athlete'}>
          <NewAthleteForm />
        </Box>
      </div>
    </main>
  );
}
