import React from 'react';
import Link from 'next/link';
import Logo from './Logo';
import { routes } from '@/app/lib/routes';
import {
  AwardIcon,
  CalendarIcon,
  HomeIcon,
  UsersIcon,
  SettingsIcon,
} from '@/app/ui/icons';
import { IconType as ReactIconType } from 'react-icons';
import { auth } from '@/auth';
import UserMenu from './UserMenu';
import MobileNav from './MobileNav';

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

  settings: {
    name: 'Settings',
    href: '/settings',
    description: 'Configure your profile and account settings.',
    icon: SettingsIcon
  }
};

const Navigation: React.FC<NavigationProps> = async ({ currentPage }) => {
  const session = await auth();
  const isLoggedIn = !!session?.user;
  const userRole = (session?.user as { role?: string })?.role;

  const filteredNavItems = Object.values(navItems).filter((item) => {
    // Basic pages available for all logged-in users
    if (['Dashboard'].includes(item.name)) return isLoggedIn;

    // Admin-only sections
    if (['Athletes', 'Events', 'Results', 'Settings'].includes(item.name)) {
      return userRole === 'ADMIN';
    }

    return true;
  });

  return (
    <header className='bg-white shadow-sm dark:border-b dark:border-neutral-700 dark:bg-neutral-900'>
      <div className='mx-auto max-w-7xl px-4 sm:px-6 lg:px-8'>
        <div className='flex h-16 justify-between'>
          <div className='flex items-center'>
            <Logo className='mr-8' />
            <nav className='hidden space-x-4 md:flex'>
              {filteredNavItems.map((item) => {
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
            <MobileNav>
              <div className='space-y-1 px-2 py-3'>
                {filteredNavItems.map((item) => {
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
            </MobileNav>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navigation;
