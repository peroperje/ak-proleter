import Link from 'next/link';
import Box from '@/app/components/Box';
import Button from '@/app/ui/button';
import PageLayout from '@/app/components/PageLayout';
import { navItems } from '@/app/lib/routes/index';

export default function Dashboard() {
  return (
    <PageLayout title='Dashboard'>
      <div className='grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3'>
        {Object.values(navItems)
          .filter((item) => item.name !== 'Dashboard')
          .map((item) => (
            <Box key={item.name} icon={item.icon} title={item.name}>
              <div className='flex flex-col space-y-4'>
                <p className='text-gray-700 dark:text-gray-300'>
                  {item.description}
                </p>
                <Link href={item.href()}>
                  <Button variant='outline'>View {item.name}</Button>
                </Link>
              </div>
            </Box>
          ))}
      </div>
    </PageLayout>
  );
}
