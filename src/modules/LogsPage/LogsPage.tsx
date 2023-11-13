import { useEffect, useRef, useState, ChangeEvent } from 'react';
import { generateDataService } from 'services/generateDataService';
import {
  DataTable,
  DataTableSelectionSingleChangeEvent,
} from 'primereact/datatable';
import { Column } from 'primereact/column';
import './LogsPage.scss';
import { degreeCellTemplate, prepareLog, rowClass } from './utils';
import { EventType } from 'shared/types/Events';
import { useInterval, useEventListener } from 'primereact/hooks';
import { InputText } from 'primereact/inputtext';
import { FilterMatchMode } from 'primereact/api';

export const LogsPage = () => {
  const [logs, setLogs] = useState<EventType[]>([]);
  const [messagesCount, setMessagesCount] = useState<number>(0);
  const [selectedLog, setSelectedLog] = useState<null | EventType>(null);
  const [globalFilterValue, setGlobalFilterValue] = useState('');
  const [filters, setFilters] = useState({
    global: { value: '', matchMode: FilterMatchMode.CONTAINS },
    degree: { value: '', matchMode: FilterMatchMode.EQUALS },
    executor: { value: '', matchMode: FilterMatchMode.STARTS_WITH },
  });

  const logsRef = useRef(logs);
  logsRef.current = logs;

  useInterval(
    () => {
      setLogs([
        ...logsRef.current,
        prepareLog(generateDataService.generateEvent()),
      ]);
      setMessagesCount((prev) => prev + 1);
    },
    2500,
    messagesCount < 1000
  );

  const [bindSpaceDown, unbindSpaceDown] = useEventListener({
    type: 'keydown',
    listener: (e) => {
      if (e instanceof KeyboardEvent && e.code === 'Space') onKeyDown();
    },
  });

  useEffect(() => {
    bindSpaceDown();
    return () => {
      unbindSpaceDown();
    };
  }, [bindSpaceDown, unbindSpaceDown]);

  const onKeyDown = () => {
    const newLogs = logs.map((log) => {
      if (log.id === selectedLog?.id) log.isUnread = false;
      return log;
    });
    setLogs(newLogs);
  };

  const onSelectionChange = (
    e: DataTableSelectionSingleChangeEvent<EventType[]>
  ) => {
    if (e.value !== null && e.value !== undefined) {
      setSelectedLog(e.value);
    }
  };

  const onGlobalFilterChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e?.target?.value;
    let _filters = { ...filters };
    _filters['global'].value = value;
    setFilters(_filters);
    setGlobalFilterValue(value);
  };

  return (
    <div className='logs'>
      <div className='logs__search'>
        <InputText
          value={globalFilterValue}
          onChange={onGlobalFilterChange}
          placeholder='Поиск'
        />
      </div>
      <DataTable
        filters={filters}
        value={logs}
        rowClassName={rowClass}
        showGridlines
        paginator
        rows={5}
        rowsPerPageOptions={[5, 10]}
        sortField='time'
        sortOrder={-1}
        tableStyle={{ width: '50rem' }}
        emptyMessage='Событий не найдено'
        selection={selectedLog}
        onSelectionChange={onSelectionChange}
        dataKey='id'
        selectionMode='single'
        metaKeySelection={true}
        style={{
          minHeight: '90vh',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          border: '1px solid LightGray',
        }}>
        <Column field='time' header='Дата' style={{ width: '10%' }} sortable />
        <Column
          field='degree'
          header='Важность'
          body={degreeCellTemplate}
          style={{ width: '20%' }}
        />
        <Column
          field='equipment'
          header='Оборудование'
          style={{ width: '20%' }}
        />
        <Column field='message' header='Сообщение' style={{ width: '28%' }} />
        <Column
          field='executor'
          header='Ответственный'
          style={{ width: '22%' }}
        />
      </DataTable>
    </div>
  );
};
