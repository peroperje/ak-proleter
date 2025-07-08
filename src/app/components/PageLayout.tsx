import React, { ReactNode } from 'react';

interface PageLayoutProps {
  children: ReactNode;
  title: string;
  action?: ReactNode;
}

const PageLayout: React.FC<PageLayoutProps> = ({
  children,
  title,
  action
}) => {
  return (
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0 relative">
          {(title || action) && (
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{title}</h1>
              {action && (
                <div>{action}</div>
              )}
            </div>
          )}

          {children}
        </div>
      </main>
  );
};

export default PageLayout;
