import Link from "next/link";
import Box from "@/app/views/Box";
import Button from "@/app/ui/button";
import PageLayout from "@/app/components/PageLayout";
import { navItems } from "@/app/lib/routes";

export default function Dashboard() {
  // Descriptions for each navigation item
  const descriptions = {
    'Dashboard': 'View overall statistics and recent activities.',
    'Athletes': 'Manage athlete profiles, view statistics, and track progress.',
    'Events': 'Manage competitions, training sessions, and other events.',
    'Results': 'Record and analyze athlete performance results.',
    'Training': 'Plan and track training sessions and exercises.',
    'Coaches': 'Manage coach profiles and assignments.',
    'Reports': 'Generate reports and analytics on athlete performance.'
  };

  return (
    <PageLayout title="Dashboard" currentPage="dashboard">
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {navItems.filter(item => item.name !== 'Dashboard').map((item) => (
          <Box key={item.name} title={item.name}>
            <div className="flex flex-col space-y-4">
              <p className="text-gray-700 dark:text-gray-300">
                {descriptions[item.name]}
              </p>
              <Link href={item.href}>
                <Button variant="outline">View {item.name}</Button>
              </Link>
            </div>
          </Box>
        ))}
      </div>
    </PageLayout>
  );
}
