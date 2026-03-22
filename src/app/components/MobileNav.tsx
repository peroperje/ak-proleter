'use client';

import React, { useState } from 'react';
import { MenuIcon, XIcon } from '@/app/ui/icons';

interface MobileNavProps {
  children: React.ReactNode;
}

export default function MobileNav({ children }: MobileNavProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <div className='ml-2 flex flex-shrink-0 items-center md:hidden'>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className='inline-flex items-center justify-center rounded-md p-2 text-gray-500 hover:bg-gray-100 hover:text-gray-700 focus:outline-none dark:text-gray-400 dark:hover:bg-neutral-800 dark:hover:text-white'
          aria-expanded={isOpen}
        >
          <span className='sr-only'>Open main menu</span>
          {isOpen ? (
            <XIcon className='block h-6 w-6' aria-hidden='true' />
          ) : (
            <MenuIcon className='block h-6 w-6' aria-hidden='true' />
          )}
        </button>
      </div>

      {isOpen && (
        <div className='absolute left-0 right-0 top-16 z-50 border-b border-gray-200 bg-white shadow-lg md:hidden dark:border-neutral-700 dark:bg-neutral-900'>
          <div onClick={() => setIsOpen(false)}>
            {children}
          </div>
        </div>
      )}
    </>
  );
}
