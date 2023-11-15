import { getDegreeTag } from 'shared/utils/getDegreeTag';
import { Tag } from 'primereact/tag';
import { FC, MouseEventHandler } from 'react';
import { EventType } from 'shared/types/Events';

type PropsType = { event: EventType };

export const Card: FC<PropsType> = ({ event }) => {
/*

  const onSelect = (event: Event) => {
    setSelectedEvents([event]);
    if (isCmdPressed || isControlPressed) onSelectionChangePressedCmd(event);
  };*/

  const clickCard = (e: MouseEventHandler<HTMLDivElement>) => {
    console.log(e);
  };
  return (
    <article
      className={`grid grid-cols-[105px_1fr_1fr] ${
        event.isUnread ? 'bg-amber-200' : 'bg-amber-50 opacity-70'
      } rounded-2xl p-2.5 px-3.5 box-border gap-2.5 gap-y-1.5 justify-items-start`}
     >
      <h4 className='text-sm'>Дата</h4>
      <span className='text-sm font-semibold '>{event.time}</span>
      <div className='row-start-1 row-end-3 col-start-3 col-end-4  text-sm self-center justify-self-center flex flex-col justify-center items-center gap-2'>
        <div className='flex  overflow-hidden '>
          <img
            className='relative inline-block h-14 w-14 rounded-full border-2 border-white object-cover object-center hover:z-10 focus:z-10'
            src={event.photoUrl}
            alt={event.executor}
          />
        </div>
        <span className='text-sm font-bold'>{event.executor}</span>
      </div>
      <h4 className='text-sm '>Важность</h4>
      <Tag
        value={event.degree}
        severity={getDegreeTag(event.degree)}
        className=' w-[110px] h-6 text-sm'></Tag>
      <h4 className='text-sm '>Оборудование</h4>
      <span className='text-sm font-semibold'>{event.equipment}</span>

      <h4 className='text-sm col-start-1 col-end-2'>Сообщение</h4>
      <span className='text-sm font-semibold col-start-2 col-end-4 text-left'>
        {event.message}
      </span>
    </article>
  );
};
