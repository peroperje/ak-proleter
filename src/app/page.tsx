import Box from '@/app/components/Box';
import PageLayout from '@/app/components/PageLayout';


export default function Dashboard() {
  return (
    <PageLayout title='Dashboard'>
      <Box title={'Time Line Box'} >
        <div className='flex flex-col space-y-4'>
          <p className='text-gray-700 dark:text-gray-300'>
           UNDER construction
          </p>

        </div>
      </Box>
    </PageLayout>
  );
}
