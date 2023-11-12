import { useEffect, useRef, useState } from 'react';
import { generateDataService } from 'services/generateDataService';
import { EventDTO } from 'shared/models';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import './LogsPage.css';
import { degreeCellTemplate, prepareLog, rowClass } from './utils';

export const LogsPage = () => {
  const [logs, setLogs] = useState<EventDTO[]>([]);
  const [messagesCount, setMessagesCount] = useState<number>(0);
  const timerRef = useRef<number | undefined>(undefined);
  const logsRef = useRef(logs);
  logsRef.current = logs;

  useEffect(() => {
    timerRef.current = setInterval(() => {
      setLogs([...logsRef.current, generateDataService.generateEvent()]);
      setMessagesCount((prev) => prev + 1);
    }, 2500);

    return () => clearTimeout(timerRef.current);
  }, []);

  useEffect(() => {
    if (messagesCount > 1000) clearTimeout(timerRef.current);
  }, [messagesCount]);


  return (
    <>
      <DataTable
        value={logs.map((item) => prepareLog(item))}
        rowClassName={rowClass}
        showGridlines
        stripedRows
        paginator
        rows={5}
        rowsPerPageOptions={[5, 10]}
        sortField='time'
        sortOrder={-1}
        tableStyle={{ width: '50rem' }}
        emptyMessage='Журнал событий пуст'
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
    </>
  );
};
