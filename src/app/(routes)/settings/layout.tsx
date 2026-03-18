import React from 'react';
import PageLayout from '@/app/components/PageLayout';
import Link from 'next/link';

export default function SettingsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <PageLayout title="Settings">
      <div className="flex flex-col md:flex-row gap-6">
        <aside className="w-full md:w-64">
          <nav className="flex flex-col gap-2">
            <Link 
              href="/settings/ai-models" 
              className="px-4 py-3 rounded-xl border border-gray-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 hover:bg-gray-50 dark:hover:bg-neutral-700 transition-all font-medium text-gray-700 dark:text-gray-200 shadow-sm"
            >
              AI Models
            </Link>
            {/* Future settings sub-pages can be added here */}
          </nav>
        </aside>
        <div className="flex-1">
          {children}
        </div>
      </div>
    </PageLayout>
  );
}
