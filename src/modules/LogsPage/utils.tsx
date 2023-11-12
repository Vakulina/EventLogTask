import { Tag } from 'primereact/tag';
import { EventDTO } from 'shared/models';
import { EventType } from 'shared/types/Events';

export const prepareLog = (log: EventDTO): EventType => {
  return {
    ...log,
    degree: log.degree.name,
    equipment: log.equipment?.name||'',
    isUnread:true,
  };
};
  export const rowClass = (data: EventType) => {
    return {
      'bg-primary': data.isUnread,
      'row':true
    };
  };
 const getDegreeTag = (status: string) => {
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