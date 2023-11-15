import { Tag } from 'primereact/tag';
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
    'logs__row_bg-primary': data.isUnread,
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
