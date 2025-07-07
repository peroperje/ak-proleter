import React from 'react';
import Link from 'next/link';
import ProfilePhotos from '@/app/components/athletes/ProfilePhotos';
import { Athlete } from '@/app/lib/definitions';
import { navItems } from '@/app/lib/routes';
import EditLink from '@/app/components/athletes/AthletesCard/EditLink';


interface UserCardProps {
  athlete: Athlete;
}

const AthletesCard: React.FC<UserCardProps> = ({ athlete }) => {
  // Calculate age
  const today = new Date();
  const birthDate = new Date(athlete.dateOfBirth);
  const age = today.getFullYear() - birthDate.getFullYear() -
    (today.getMonth() < birthDate.getMonth() ||
    (today.getMonth() === birthDate.getMonth() && today.getDate() < birthDate.getDate()) ? 1 : 0);

  return (

      <div
        className="relative flex flex-col rounded-xl border border-gray-200 bg-white shadow-md dark:border-neutral-700 dark:bg-neutral-900 dark:shadow-neutral-700/70 overflow-hidden"
      >
        <EditLink />
        <Link href={navItems.athletes.href({ id: athlete.id })}>
          <div className="p-4 flex flex-col items-center">
            <div className="flex items-center justify-between mb-4 w-full">
          <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
            athlete.active
              ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
              : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
          }`}>
            {athlete.active ? 'Active' : 'Inactive'}
          </span>

            </div>
            <div className="mb-4">
              <ProfilePhotos
                src={athlete?.photoUrl || ''}
                alt={`${athlete.firstName} ${athlete.lastName}`}
                className="w-20 h-20 rounded-full object-cover"
              />
            </div>

            <div className="text-center mb-4">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                {athlete.firstName} {athlete.lastName}
              </h3>
              <p className="text-sm text-gray-500 dark:text-neutral-400">
                {athlete.email}
              </p>
            </div>

            <div className="grid grid-cols-3 gap-2 w-full mb-4">
              <div className="flex flex-col text-xs">
                <span className="text-gray-500 dark:text-neutral-400">Age:</span>
                <span className="ml-1 text-gray-900 dark:text-white">{age}</span>
              </div>
              <div className="flex flex-col text-xs">
                <span className="text-gray-500 dark:text-neutral-400">Gender:</span>
                <span className="ml-1 text-gray-900 dark:text-white">
              {athlete.gender === 'male' ? 'Male' : 'Female'}
            </span>
              </div>
              <div className="flex flex-col text-xs ">
                <span className="text-gray-500 dark:text-neutral-400">Category:</span>
                <span className="ml-1 text-gray-900 dark:text-white">
              {athlete.categories?.join(', ') || 'None'}
            </span>
              </div>
            </div>
          </div>
        </Link>
      </div>
  );
};

export default AthletesCard;
