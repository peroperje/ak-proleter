'use client';
import React, { ReactElement, useEffect, useState } from 'react';
import { Event } from '@/app/lib/definitions';
import clsx from 'clsx';
import { IoCloseCircleOutlineIcon } from '@/app/ui/icons';
import Image from 'next/image';
import { eventStatusStyles } from '@/app/lib/constants/styles';
import InputField from '@/app/ui/input-field';

interface Props {
  events: Event[];
  defaultEventId?: string;
  errors?: string[]
}

const EventField: React.FC<Props> = ({ events, errors, defaultEventId }): ReactElement => {
  const [selected, setSelected] = useState<Event>();
  const [search, setSearch] = useState<string>('');

  useEffect(() => {
    if(defaultEventId){
      const event = events.find((e)=>e.id ===  defaultEventId);
      if (event){
        setSelected(event)
      }
    }
  }, [events, defaultEventId, setSelected]);
  return (
    <div className={'flex w-full flex-col'}>
      <label
        htmlFor='eventId'
        className={clsx('block text-sm font-bold dark:text-white',{
          'text-red-500 dark:text-red-400': errors && errors.length > 0
        })}
      >
        Event
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
          id='eventId'
          name='eventId'
          value={selected?.id || ''}
        />
        {!!selected && (
          <div className={'flex w-full flex-col gap-4'}>
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
            {
             selected.type === 'COMPETITION' && <InputField
                placeholder={'1'}
                name='position'
                title='Position'
                type='number'
                step={1}
              />
            }
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
                'grid h-50 w-full auto-rows-[100px] grid-cols-[repeat(auto-fill,minmax(200px,1fr))] gap-4 overflow-y-auto'
              }
            >
              {events
                .filter(({ name }: Event) => {
                  if (search.length > 0) {
                    return name.toLowerCase().includes(search.toLowerCase());
                  }
                  return true;
                })
                .map((event) => {
                  const { id, type, name, status } = event;
                  return (
                    <div
                      key={id}
                      className={clsx(
                        'flex cursor-pointer items-start gap-4 rounded-lg border-1 border-gray-200 p-3 md:p-3',
                      )}
                      onClick={() => setSelected(event)}
                    >
                      <div className='relative h-10 w-10 flex-shrink-0 overflow-hidden rounded-full border-2 border-gray-500 shadow-lg'>
                        <Image
                          src={`/event-img/${type}.png`}
                          alt={`${type} event`}
                          fill
                          className='object-contain p-1'
                          sizes='(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw'
                        />
                      </div>
                      <div
                        className={
                          'flex flex-col gap-1 overflow-x-hidden text-sm'
                        }
                      >
                        <p
                          className={
                            'text-gray-500 capitalize dark:text-neutral-400'
                          }
                        >
                          {type.toLowerCase()}
                        </p>
                        <p
                          className={
                            'truncate text-gray-500 dark:text-neutral-400'
                          }
                        >
                          {name}
                        </p>
                        <p
                          className={`inline-flex justify-center rounded-full px-2 py-1 text-xs leading-5 font-semibold ${eventStatusStyles[status]}`}
                        >
                          {status.charAt(0).toUpperCase() + status.slice(1)}
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
export default EventField;
