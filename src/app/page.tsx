import PageLayout from '@/app/components/PageLayout';
import TimelineList from '@/app/components/timeline/TimelineList';
import { getTimeline } from '@/app/lib/service/timeline';

export const dynamic = 'force-dynamic';
export const revalidate = 0;
export const fetchCache = 'force-no-store';

export default async function Dashboard() {
  const initialData = await getTimeline(10, 0);

  return (
    <PageLayout title=''>
      <TimelineList initialData={initialData} />
    </PageLayout>
  );
}
