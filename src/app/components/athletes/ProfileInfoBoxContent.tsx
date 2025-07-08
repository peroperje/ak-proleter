import React, { ReactElement } from 'react';
import ProfilePhotos from '@/app/components/athletes/ProfilePhotos';
import { Athlete } from '@/app/lib/definitions';

function calculateAge(dateOfBirth: Date): number {
  const today = new Date();
  const birthDate = new Date(dateOfBirth);
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDifference = today.getMonth() - birthDate.getMonth();

  if (monthDifference < 0 || (monthDifference === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }

  return age;
}

function formatDate(date: Date): string {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
}

type ProfileInformationProps = Pick<
  Athlete,
  | 'firstName'
  | 'lastName'
  | 'gender'
  | 'photoUrl'
  | 'active'
  | 'dateOfBirth'
  | 'categories'
>;
const ProfileInfoBoxContent: React.FC<ProfileInformationProps> = ({
  firstName,
  lastName,
  gender,
  active,
  photoUrl,
  dateOfBirth,
  categories
}): ReactElement => {
  const age = calculateAge(dateOfBirth);
  return (
    <>
      <div className='mb-6 flex flex-col items-start md:flex-row'>
        <div className='mr-4 mb-4 md:mb-0'>
          <div className='flex h-24 w-24 items-center justify-center overflow-hidden rounded-full bg-gray-100'>
            {photoUrl ? (
              <ProfilePhotos
                property='true'
                src={photoUrl}
                alt={`${firstName} ${lastName}`}
                className='h-full w-full object-cover'
              />
            ) : (
              <div className='text-4xl text-gray-400'>
                {firstName.charAt(0)}
                {lastName.charAt(0)}
              </div>
            )}
          </div>
          <div className='mt-2 text-center'>
            <span
              className={`inline-flex rounded-full px-2 py-1 text-xs leading-5 font-semibold ${
                active
                  ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                  : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
              }`}
            >
              {active ? 'Active' : 'Inactive'}
            </span>
          </div>
        </div>
        <div className={'flex flex-auto flex-col gap-3'}>
          <h2 className='text-2xl font-bold text-gray-900 dark:text-white'>
            {firstName} {lastName}
          </h2>
          <div className='flex flex-wrap gap-4'>
            <div className={'flex flex-auto flex-col gap-0'}>
              <h3 className='text-sm font-medium text-gray-500 dark:text-neutral-400'>
                Age
              </h3>
              <p className='mt-1 text-sm text-gray-900 dark:text-white'>
                {age} years
              </p>
            </div>
            <div className={'flex flex-auto flex-col gap-0'}>
              <h3 className='text-sm font-medium text-gray-500 dark:text-neutral-400'>
                Gender
              </h3>
              <p className='mt-1 text-sm text-gray-900 dark:text-white'>
                {gender === 'male' ? 'Male' : 'Female'}
              </p>
            </div>
            <div className={'flex flex-auto flex-col gap-0'}>
              <h3 className='text-sm font-medium text-gray-500 dark:text-neutral-400'>
                Date of Birth
              </h3>
              <p className='mt-1 text-sm text-gray-900 dark:text-white'>
                {formatDate(dateOfBirth)}
              </p>
            </div>

            <div className={'flex flex-auto flex-col gap-0'}>
              <h3 className='text-sm font-medium text-gray-500 dark:text-neutral-400'>
                Categories
              </h3>
              <p className='mt-1 text-sm text-gray-900 dark:text-white'>
                {categories && categories.length > 0
                  ? categories.join(', ')
                  : 'None'}
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ProfileInfoBoxContent;
