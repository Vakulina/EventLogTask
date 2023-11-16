import { Tag } from 'primereact/tag';
import { classNames } from 'primereact/utils';
import { EventDTO } from 'shared/models';
import { EventType } from 'shared/types/Events';

export const prepareLog = (log: EventDTO): EventType => {
  return {
    ...log,
    degree: log.degree.name,
    equipment: log.equipment?.name || '',
    isUnread: true,
  };
};
export const rowClass = (data: EventType) => {
  return {
    'h-[12vh] bg-amber-200  focus:text-grey': true,
    'opacity-100 cursor-pointer focus:outline focus:outline-3 focus:outline-gray outline-offset-[-0.25rem]':
      data.isUnread,
    'opacity-60 cursor-none focus-visible:outline-none': !data.isUnread,
    logs__row: true,
  };
};
export const getDegreeTag = (status: string) => {
  switch (status) {
    case 'Критическая':
      return 'danger';
    case 'Высокая':
      return 'warning';
    case 'Низкая':
      return 'info';
    case 'renewal':
      return null;
  }
};

export const degreeCellTemplate = (rowData: EventType) => {
  return (
    <Tag
      value={rowData.degree}
      className='xs:text-sm xs:p-1.5 xs:text-xs'
      severity={getDegreeTag(rowData.degree)}
      rounded
    />
  );
};

export const executorFilterItemTemplate = (option: string) => {
  return (
    <div className='flex align-items-center gap-2'>
      <span>{option}</span>
    </div>
  );
};
export const getExecutorsList = (events: EventType[]): string[] => {
  const result: Set<string> = new Set();
  events.map((item) => result.add(item.executor));
  return [...result];
};
