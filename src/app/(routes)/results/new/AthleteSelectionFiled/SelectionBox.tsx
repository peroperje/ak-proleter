'use client'
import React, { ReactElement, use, useState } from 'react';
import ProfilePhotos from '@/app/components/athletes/ProfilePhotos';
import { Athlete } from '@/app/lib/definitions';
import clsx from 'clsx';

interface Props {
  athletes: Promise<Athlete[]>
}
const SelectionBox: React.FC<Props> = ({athletes}): ReactElement => {
  const [selected,setSelected] = useState<string>('')
  const athletesList = use(athletes);
  return (
    <>
      <div
        className={'flex flex-wrap gap-4 rounded-lg border-1 border-gray-200'}
      >
        <input type='hidden' name='athleteId' value='1' />
        <div
          className={
            'sm::grid-cols-2 grid h-50 w-full grid-cols-1 gap-4 overflow-y-scroll p-4 md:grid-cols-3 md:p-5 lg:grid-cols-4 xl:grid-cols-6'
          }
        >
          {athletesList.map(({ id, photoUrl, firstName, lastName }) => (
            <div
              key={id}
              className={clsx(
                'grid grid-cols-2 items-center gap-4 rounded-lg border-1 border-gray-200 p-3 md:p-3',
                { 'bg-blue-300': selected === id },
              )}
              onClick={() => setSelected(id)}
            >
              <ProfilePhotos
                src={photoUrl || ''}
                alt={`${firstName} ${lastName}`}
                className='h-13 w-13 rounded-full object-cover'
              />
              <div className={'flex flex-col text-sm'}>
                <p className={'text-gray-500 dark:text-neutral-400'}>
                  {firstName}
                </p>
                <p className={'text-gray-500 dark:text-neutral-400'}>
                  {' '}
                  {lastName}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
export default SelectionBox;
