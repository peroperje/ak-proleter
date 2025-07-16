'use client';
import React, { ReactElement, useEffect, useState } from 'react';
import clsx from 'clsx';
import { IoCloseCircleOutlineIcon } from '@/app/ui/icons';
import { GetDisciplineReturn } from '@/app/lib/actions/dicipline';
import InputField from '@/app/ui/input-field';

interface Props {
  disciplines: GetDisciplineReturn;
  errors?: string[],
  defaultDisciplineId?: string;
  defaultScore?: number | string;
}

const DisciplineScoreField: React.FC<Props> = ({ disciplines,errors, defaultDisciplineId, defaultScore }): ReactElement => {
  const [selected, setSelected] = useState<GetDisciplineReturn[0]>();
  const [search, setSearch] = useState<string>('');
  useEffect(()=>{
    if(defaultDisciplineId){
      setSelected((prevState)=>{
        if(defaultDisciplineId){
          const discipline = disciplines.find((d)=>d.id ===  defaultDisciplineId);
          if (discipline){
            return discipline
          }
        }
        return prevState
      })
    }
  },[
   defaultDisciplineId,
    disciplines
  ])
  return (
    <div className={'flex w-full flex-col'}>
      <label
        htmlFor='eventId'
        className={
        clsx('block text-sm font-bold dark:text-white',{
          'text-red-500 dark:text-red-400': errors && errors.length > 0
        })
      }
      >
        Score & Discipline
      </label>
      <div
        className={
          clsx('flex flex-col gap-4 rounded-lg border-1 border-gray-200 p-4 text-gray-500 dark:text-neutral-400',{
            'border-red-500 dark:border-red-400': errors && errors.length > 0,
          })
        }
      >
        <div className={'flex flex-col gap-2'}>
          <label
            htmlFor='disciplineId'
            className={clsx('block text-sm font-bold dark:text-white')}
          >
            Discipline
          </label>
          <input
            type='hidden'
            id='disciplineId'
            name='disciplineId'
            value={selected?.id || ''}
          />

          {!!selected && (
            <div
              id='discipline'
              className={clsx(
                'flex w-full cursor-pointer items-center gap-4 rounded-lg border-1 border-blue-300 bg-blue-100 p-2',
              )}
              onClick={() => setSelected(undefined)}
            >
              <div className={'flex flex-col gap-0 text-sm'}>
                <p className={'font-bold text-gray-500 dark:text-neutral-400'}>
                  {selected.name} is selected
                </p>
                <p className={'text-gray-500 dark:text-neutral-400'}>
                  {selected.description}
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
                    placeholder={'Search Discipline'}
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
                  'grid h-50 w-full auto-rows-[70px] grid-cols-[repeat(auto-fill,minmax(200px,1fr))] gap-4 overflow-y-auto'
                }
              >
                {disciplines
                  .filter(({ name, description }) => {
                    if (search.length > 0) {
                      return (
                        name.toLowerCase().includes(search.toLowerCase()) ||
                        description
                          ?.toLowerCase()
                          .includes(search.toLowerCase())
                      );
                    }
                    return true;
                  })
                  .map((discipline) => {
                    const { id, name, description } = discipline;
                    return (
                      <div
                        key={id}
                        className={clsx(
                          'flex cursor-pointer items-center gap-4 rounded-lg border-1 border-gray-200 p-3 md:p-3',
                        )}
                        onClick={() => setSelected(discipline)}
                      >
                        <div
                          className={'flex flex-col overflow-x-hidden text-sm'}
                        >
                          <p
                            className={
                              'text-xs font-bold text-gray-500 dark:text-neutral-400'
                            }
                          >
                            {name}
                          </p>
                          <p
                            className={
                              'text-xs text-gray-500 capitalize dark:text-neutral-400'
                            }
                          >
                            {description}
                          </p>
                        </div>
                      </div>
                    );
                  })}
              </div>
            </>
          )}
        </div>
        <div className={'relative w-full'}>
          <InputField
            defaultValue={defaultScore}
            type={'number'}
            step={'any'}
            key={selected?.id}
            name='score'
            title='Score'
            required={true}
            placeholder={'Your score in selected discipline'}
          />
          {selected?.unit && (
            <p
              className={
                'absolute top-6/12 right-2 text-gray-300 dark:text-neutral-200'
              }
            >
              {selected.unit.name}
            </p>
          )}
        </div>
      </div>
      {
        !!errors && errors.length > 0 && <p className={'text-sm text-red-500 dark:text-red-400'}>
          {errors?.join(' ')}
        </p>
      }
    </div>
  );
};
export default DisciplineScoreField;
