import React from 'react';
import Link from 'next/link';
import { navItems } from '@/app/lib/routes';
import { icons } from '@/app/lib/icons';
import Logo from './Logo';

interface NavigationProps {
  currentPage?: string;
}

const Navigation: React.FC<NavigationProps> = ({ currentPage }) => {

  return (
    <header className="bg-white shadow-sm dark:bg-neutral-900 dark:border-b dark:border-neutral-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Logo className="mr-8" />
            <nav className="hidden md:flex space-x-4">
              {Object.values(navItems).map((item) => {
                const IconComponent = item.icon ? icons[item.icon] : null;
                return (
                  <Link
                    key={item.name}
                    href={item.href()}
                    className={`px-3 py-2 rounded-md text-sm font-medium flex items-center ${
                      currentPage === item.name.toLowerCase() 
                        ? 'bg-gray-100 text-gray-900 dark:bg-neutral-800 dark:text-white' 
                        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900 dark:text-gray-300 dark:hover:bg-neutral-800 dark:hover:text-white'
                    }`}
                  >
                    {IconComponent && <IconComponent className="mr-2" size={16} />}
                    {item.name}
                  </Link>
                );
              })}
            </nav>
          </div>
          <div className="flex items-center">
            <Link href="/login" className="text-sm text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white">
              Login
            </Link>
          </div>
        </div>
      </div>

      {/* Mobile navigation menu - shown on small screens */}
      <div className="md:hidden border-t border-gray-200 dark:border-neutral-700">
        <div className="px-2 py-3 space-y-1">
          {Object.values(navItems).map((item) => {
            const IconComponent = item.icon ? icons[item.icon] : null;
            return (
              <Link
                key={item.name}
                href={item.href()}
                className={`flex items-center px-3 py-2 rounded-md text-base font-medium ${
                  currentPage === item.name.toLowerCase()
                    ? 'bg-gray-100 text-gray-900 dark:bg-neutral-800 dark:text-white'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900 dark:text-gray-300 dark:hover:bg-neutral-800 dark:hover:text-white'
                }`}
              >
                {IconComponent && <IconComponent className="mr-2" size={18} />}
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
