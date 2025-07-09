import React from 'react';
import Link from 'next/link';
import { navItems } from '@/app/lib/routes';
import Logo from './Logo';

interface NavigationProps {
  currentPage?: string;
}

const Navigation: React.FC<NavigationProps> = ({ currentPage }) => {
  return (
    <header className='bg-white shadow-sm dark:border-b dark:border-neutral-700 dark:bg-neutral-900'>
      <div className='mx-auto max-w-7xl px-4 sm:px-6 lg:px-8'>
        <div className='flex h-16 justify-between'>
          <div className='flex items-center'>
            <Logo className='mr-8' />
            <nav className='hidden space-x-4 md:flex'>
              {Object.values(navItems).map((item) => {
                const IconComponent = item.icon;
                return (
                  <Link
                    key={item.name}
                    href={item.href()}
                    prefetch={true}
                    className={`flex items-center rounded-md px-3 py-2 text-sm font-medium ${
                      currentPage === item.name.toLowerCase()
                        ? 'bg-gray-100 text-gray-900 dark:bg-neutral-800 dark:text-white'
                        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900 dark:text-gray-300 dark:hover:bg-neutral-800 dark:hover:text-white'
                    }`}
                  >
                    {IconComponent && (
                      <IconComponent className='mr-2' size={16} />
                    )}
                    {item.name}
                  </Link>
                );
              })}
            </nav>
          </div>
          <div className='flex items-center'>
            <Link
              href='/login'
              className='text-sm text-gray-700 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white'
            >
              Login
            </Link>
          </div>
        </div>
      </div>

      {/* Mobile navigation menu - shown on small screens */}
      <div className='border-t border-gray-200 md:hidden dark:border-neutral-700'>
        <div className='space-y-1 px-2 py-3'>
          {Object.values(navItems).map((item) => {
            const IconComponent = item.icon;
            return (
              <Link
                key={item.name}
                href={item.href()}
                className={`flex items-center rounded-md px-3 py-2 text-base font-medium ${
                  currentPage === item.name.toLowerCase()
                    ? 'bg-gray-100 text-gray-900 dark:bg-neutral-800 dark:text-white'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900 dark:text-gray-300 dark:hover:bg-neutral-800 dark:hover:text-white'
                }`}
              >
                {IconComponent && <IconComponent className='mr-2' size={18} />}
                {item.name}
              </Link>
            );
          })}
        </div>
      </div>
    </header>
  );
};

export default Navigation;
