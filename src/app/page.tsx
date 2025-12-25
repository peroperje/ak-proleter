import Box from '@/app/components/Box';
import PageLayout from '@/app/components/PageLayout';
import TimelineList from '@/app/components/timeline/TimelineList';
import { getTimeline } from '@/app/lib/service/timeline';

export default async function Dashboard() {
  const initialData = await getTimeline(10, 0);

  return (
    <PageLayout title='Dashboard'>
      <Box title={'Activity Feed'} >
        <TimelineList initialData={initialData} />
      </Box>
    </PageLayout>
  );
}
