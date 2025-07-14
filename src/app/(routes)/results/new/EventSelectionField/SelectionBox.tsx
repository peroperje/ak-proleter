'use client';
import React, { ReactElement, useState } from 'react';
import { Event } from '@/app/lib/definitions';
import clsx from 'clsx';
import { IoCloseCircleOutlineIcon } from '@/app/ui/icons';
import Image from 'next/image';

interface Props {
  events: Event[];
}

const SelectionBox: React.FC<Props> = ({ events }): ReactElement => {
  const [selected, setSelected] = useState<Event>();
  const [search, setSearch] = useState<string>('');

  return (
    <div className={'flex w-full flex-col'}>
      <label
        htmlFor='eventId'
        className={clsx('block text-sm font-bold dark:text-white')}
      >
        Event
      </label>
      <div
        className={
          'flex flex-wrap justify-center gap-4 rounded-lg border-1 border-gray-200 p-4 text-gray-500 dark:text-neutral-400'
        }
      >
        <input
          type='hidden'
          id='eventId'
          name='eventId'
          value={selected?.id || ''}
        />
        {!!selected && (
          <div
            className={clsx(
              'flex w-full cursor-pointer items-center gap-4 rounded-lg border-1 border-blue-300 bg-blue-100 p-2',
            )}
            onClick={() => setSelected(undefined)}
          >
            <div className='relative h-10 w-10 overflow-hidden rounded-full border-2 border-gray-500 shadow-lg'>
              <Image
                src={`/event-img/${selected.type}.png`}
                alt={`${selected.type} event`}
                fill
                className='object-contain p-1'
                sizes='(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw'
              />
            </div>
            <div className={'flex gap-2 text-sm'}>
              <p className={'text-gray-500 dark:text-neutral-400'}>
                {selected.name} is selected
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
              {events
                .filter(({ name }: Event) => {
                  if (search.length > 0) {
                    return (
                      name.toLowerCase().includes(search.toLowerCase())
                    );
                  }
                  return true;
                })
                .map((athlete) => {
                  const { id, type, name } = athlete;
                  return (
                    <div
                      key={id}
                      className={clsx(
                        'cursor-pointer flex items-center gap-4 rounded-lg border-1 border-gray-200 p-3 md:p-3',
                      )}
                      onClick={() => setSelected(athlete)}
                    >
                      <div className='relative flex-shrink-0 h-10 w-10 overflow-hidden rounded-full border-2 border-gray-500 shadow-lg'>
                        <Image
                          src={`/event-img/${type}.png`}
                          alt={`${type} event`}
                          fill
                          className='object-contain p-1'
                          sizes='(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw'
                        />
                      </div>
                      <div className={'flex flex-col text-sm overflow-x-hidden'}>
                        <p className={'text-gray-500 dark:text-neutral-400 truncate'}>
                          {name}
                        </p>
                        <p className={'text-gray-500 dark:text-neutral-400 capitalize'}>
                          {type.toLowerCase()}
                        </p>

                      </div>
                    </div>
                  );
                })}
            </div>
          </>
        )}
      </div>
    </div>
  );
};
export default SelectionBox;
