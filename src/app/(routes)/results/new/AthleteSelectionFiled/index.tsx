'use client';
import React, { ReactElement, useEffect, useState } from 'react';
import ProfilePhotos from '@/app/components/athletes/ProfilePhotos';
import { Athlete } from '@/app/lib/definitions';
import clsx from 'clsx';
import { IoCloseCircleOutlineIcon } from '@/app/ui/icons';

interface Props {
  athletes: Athlete[];
  errors?: string[]
  defaultAthleteId?: string;
}

const AthleteField: React.FC<Props> = ({ athletes, errors, defaultAthleteId }): ReactElement => {
  const [selected, setSelected] = useState<Athlete>();
  const [search, setSearch] = useState<string>('');
  useEffect(()=>{
    if(defaultAthleteId){
      const athlete = athletes.find((a)=>a.id ===  defaultAthleteId);
      if (athlete){
        setSelected(athlete)
      }
    }
  }, [athletes, defaultAthleteId, setSelected])
  return (
    <div className={'flex w-full flex-col'}>
      <label
        htmlFor='athleteId'
        className={clsx('block text-sm font-bold dark:text-white',
          {
            'text-red-500 dark:text-red-400': errors && errors.length > 0
          })}
      >
        Athlete
      </label>
      <div
        className={
          clsx('flex flex-wrap justify-center gap-4 rounded-lg border-1 border-gray-200 p-4 text-gray-500 dark:text-neutral-400',{
            'border-red-500 dark:border-red-400': errors && errors.length > 0,
          })
        }
      >
        <input
          type='hidden'
          id='athleteId'
          name='athleteId'
          value={selected?.id || ''}
        />
        {!!selected && (
          <div
            className={clsx(
              'flex w-full cursor-pointer items-center gap-4 rounded-lg border-1 border-blue-300 bg-blue-100 p-2',{
                'border-red-500 dark:border-red-400': errors && errors.length > 0,
              }
            )}
            onClick={() => setSelected(undefined)}
          >
            <ProfilePhotos
              src={selected.photoUrl || ''}
              alt={`${selected.firstName} ${selected.lastName}`}
              className='h-10 w-10 rounded-full object-cover'
            />
            <div className={'flex gap-2 text-sm'}>
              <p className={'text-gray-500 dark:text-neutral-400'}>
                {selected.firstName} {selected.lastName} is selected
              </p>
            </div>
            <div
              title={'Clear Search'}
              onClick={() => setSearch('')}
              className={'ml-auto block self-center'}
            >
              <IoCloseCircleOutlineIcon size={25} />
            </div>
          </div>
        )}

        {selected === undefined && (
          <>
            <div
              className={
                'flex w-full flex-col items-center text-gray-500 dark:text-neutral-400'
              }
            >
              <div className={'relative flex w-full flex-col items-center'}>
                <input
                  name={'search'}
                  title={'search'}
                  placeholder={'Search Athletes'}
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className={
                    'block w-full rounded-lg border border-gray-200 px-4 py-3 text-sm focus:border-blue-500 focus:ring-blue-500 disabled:pointer-events-none disabled:opacity-50 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-400 dark:placeholder-neutral-500 dark:focus:ring-neutral-600'
                  }
                />
                <div
                  title={'Clear Search'}
                  className={'absolute top-1/5 right-2'}
                >
                  <IoCloseCircleOutlineIcon
                    size={25}
                    onClick={() => setSearch('')}
                  />
                </div>
              </div>
            </div>
            <div
              className={
                'h-50 grid w-full gap-4 grid-cols-[repeat(auto-fill,minmax(200px,1fr))] auto-rows-[70px] overflow-y-auto'
              }
            >

              {athletes
                .filter(({ firstName, lastName }: Athlete) => {
                  if (search.length > 0) {
                    return (
                      firstName.toLowerCase().includes(search.toLowerCase()) ||
                      lastName.toLowerCase().includes(search.toLowerCase())
                    );
                  }
                  return true;
                })
                .map((athlete) => {
                  const { id, photoUrl, firstName, lastName } = athlete;
                  return (
                    <div
                      key={id}
                      className={clsx(
                        'cursor-pointer flex items-center gap-4 rounded-lg border-1 border-gray-200 p-3 md:p-3',
                      )}
                      onClick={() => setSelected(athlete)}
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
                        <p
                          className={
                            'overflow-x-hidden text-ellipsis whitespace-nowrap text-gray-500 dark:text-neutral-400'
                          }
                        >
                          {lastName}
                        </p>
                      </div>
                    </div>
                  );
                })}
            </div>
          </>
        )}
      </div>
      {
        !!errors && errors.length > 0 && <p className={'text-sm text-red-500 dark:text-red-400'}>
          {errors?.join(' ')}
        </p>
      }
    </div>
  );
};
export default AthleteField;
