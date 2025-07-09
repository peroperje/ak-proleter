import React, { ReactNode } from 'react';

interface PageLayoutProps {
  children: ReactNode;
  title: string;
  action?: ReactNode;
}

const PageLayout: React.FC<PageLayoutProps> = ({ children, title, action }) => {
  return (
    <main className='mx-auto max-w-7xl py-6 sm:px-6 lg:px-8'>
      <div className='relative px-4 py-6 sm:px-0'>
        {(title || action) && (
          <div className='mb-6 flex items-center justify-between'>
            <h1 className='text-2xl font-bold text-gray-900 dark:text-white'>
              {title}
            </h1>
            {action && <div>{action}</div>}
          </div>
        )}

        {children}
      </div>
    </main>
  );
};

export default PageLayout;
