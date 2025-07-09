import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

interface LogoProps {
  className?: string;
}

const Logo: React.FC<LogoProps> = ({ className = '' }) => {
  return (
    <Link
      href='/'
      className={`flex items-center text-sm font-bold text-red-500 hover:text-red-600 dark:text-red-500 dark:hover:text-red-400 ${className}`}
    >
      <Image
        src='/ak-proleter-zr-logo.svg'
        alt='AK Proleter Logo'
        width={40}
        height={40}
        className='mr-2'
      />
      <div className='flex flex-col text-center leading-none'>
        <span>AK Proleter</span>
        <span>Zrenjanin</span>
      </div>
    </Link>
  );
};

export default Logo;
