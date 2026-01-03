'use client';

import { signOut } from 'next-auth/react';
import { FaSignOutAlt } from 'react-icons/fa';

interface LogoutButtonProps {
    className?: string;
    showIcon?: boolean;
    iconSize?: number;
}

const LogoutButton: React.FC<LogoutButtonProps> = ({ className, showIcon = true, iconSize = 16 }) => {
    return (
        <button
            onClick={() => signOut({ callbackUrl: '/login' })}
            className={className || 'flex items-center text-sm font-medium text-gray-700 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white'}
            title='Logout'
        >
            {showIcon && <FaSignOutAlt className='mr-2' size={iconSize} />}
            Logout
        </button>
    );
};

export default LogoutButton;
