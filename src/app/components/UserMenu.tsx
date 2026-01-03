'use client';

import React, { useState, useRef, useEffect } from 'react';
import { signOut } from 'next-auth/react';
import { FaUserCircle, FaSignOutAlt } from 'react-icons/fa';

interface UserMenuProps {
    user: {
        name?: string | null;
        email?: string | null;
        image?: string | null;
    };
}

const UserMenu: React.FC<UserMenuProps> = ({ user }) => {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
        <div className='relative' ref={dropdownRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className='flex items-center space-x-2 rounded-full p-1 text-sm font-medium text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-neutral-800'
            >
                <span>{user.name || user.email}</span>
                {user.image ? (
                    <img
                        src={user.image}
                        alt='User avatar'
                        className='h-8 w-8 rounded-full shadow-sm'
                    />
                ) : (
                    <FaUserCircle className='h-8 w-8 text-gray-400' />
                )}
            </button>

            {isOpen && (
                <div className='absolute right-0 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none dark:bg-neutral-800 dark:ring-neutral-700'>
                    <button
                        onClick={() => signOut({ callbackUrl: '/login' })}
                        className='flex w-full items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-neutral-700'
                    >
                        <FaSignOutAlt className='mr-2' />
                        Logout
                    </button>
                </div>
            )}
        </div>
    );
};

export default UserMenu;
