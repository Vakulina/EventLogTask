import { Tag } from 'primereact/tag';
import { FC } from 'react';
import { EventType } from 'shared/types/Events';

type PropsType = { event: EventType };

export const Card: FC<PropsType> = ({ event }) => {
  return (
    <div className='col-12 sm:col-6 lg:col-12 xl:col-4 p-4'>
      <div className='p-4 border-1 surface-border surface-card border-round'>
        <div className='flex flex-wrap align-items-center justify-content-between gap-2'>
          <div className='flex align-items-center gap-2'>
            <i className='pi pi-tag'></i>
            <span className='font-semibold'>{event.degree}</span>
          </div>
          <Tag value={event.degree} severity={getDegreeTag(event.degree)}></Tag>
        </div>
        <div className='flex flex-column align-items-center gap-3 py-5'>
          <img
            className='w-9 shadow-2 border-round'
            src={event.photoUrl}
            alt={event.message}
          />
          <div className='text-2xl font-bold'>{event.executor}</div>
        </div>
        <div className='flex align-items-center justify-content-between'>
          <span className='text-2xl font-semibold'>${event.time}</span>
        </div>
      </div>
    </div>
  );
};
