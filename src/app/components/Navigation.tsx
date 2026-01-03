import React from 'react';
import Link from 'next/link';
import Logo from './Logo';
import { routes } from '@/app/lib/routes';
import {
  AwardIcon,
  BarChartIcon,
  CalendarIcon,
  HomeIcon,
  UsersIcon,
} from '@/app/ui/icons';
import { IconType as ReactIconType } from 'react-icons';
import { FaUserCircle } from 'react-icons/fa';
import { auth } from '@/auth';
import UserMenu from './UserMenu';
import LogoutButton from './LogoutButton';

interface NavigationProps {
  currentPage?: string;
}

export interface NavItem {
  name: string;
  href: string;
  description?: string;
  icon?: ReactIconType;
}

export interface NavItems {
  [key: string]: NavItem;
}

export const navItems: NavItems = {
  dashboard: {
    name: 'Dashboard',
    href: '/',
    description: 'View overall statistics and recent activities.',
    icon: HomeIcon
  },
  athletes: {
    name: 'Athletes',
    href: routes.athletes.list(),
    description:
      'Manage athlete profiles, view statistics, and track progress.',
    icon: UsersIcon
  },
  events: {
    name: 'Events',
    href: routes.events.list(),
    description: 'Manage competitions, training sessions, and other events.',
    icon: CalendarIcon
  },
  results: {
    name: 'Results',
    href: routes.results.list(),
    description: 'Record and analyze athlete performance results.',
    icon: AwardIcon
  },

  reports: {
    name: 'Reports',
    href: routes.reports.list(),
    description: 'Generate reports and analytics on athlete performance.',
    icon: BarChartIcon
  }
};

const Navigation: React.FC<NavigationProps> = async ({ currentPage }) => {
  const session = await auth();

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
                    href={item.href}
                    prefetch={true}
                    className={`flex items-center rounded-md px-3 py-2 text-sm font-medium ${currentPage === item.name.toLowerCase()
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
            {session?.user ? (
              <UserMenu user={session.user} />
            ) : (
              <Link
                href='/login'
                className='text-sm text-gray-700 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white'
              >
                Login
              </Link>
            )}
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
                href={item.href}
                className={`flex items-center rounded-md px-3 py-2 text-base font-medium ${currentPage === item.name.toLowerCase()
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
        <div className='border-t border-gray-200 px-4 py-4 dark:border-neutral-700'>
          {session?.user ? (
            <div className='flex items-center justify-between'>
              <div className='flex items-center space-x-3'>
                {session.user.image ? (
                  <img
                    src={session.user.image}
                    alt='User avatar'
                    className='h-10 w-10 rounded-full shadow-sm'
                  />
                ) : (
                  <FaUserCircle className='h-10 w-10 text-gray-400' />
                )}
                <div className='flex flex-col'>
                  <span className='text-sm font-medium text-gray-900 dark:text-white'>
                    {session.user.name}
                  </span>
                  <span className='text-xs text-gray-500 dark:text-gray-400'>
                    {session.user.email}
                  </span>
                </div>
              </div>
              <LogoutButton
                className='rounded-md bg-gray-100 p-2 text-gray-600 hover:bg-gray-200 dark:bg-neutral-800 dark:text-gray-300 dark:hover:bg-neutral-700'
                iconSize={18}
              />
            </div>
          ) : (
            <Link
              href='/login'
              className='flex items-center rounded-md px-3 py-2 text-base font-medium text-gray-600 hover:bg-gray-50 hover:text-gray-900 dark:text-gray-300 dark:hover:bg-neutral-800 dark:hover:text-white'
            >
              Login
            </Link>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navigation;
