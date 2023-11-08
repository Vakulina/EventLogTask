import { useEffect, useRef, useState } from 'react';
import { generateDataService } from 'services/generateDataService';
import { EventDTO } from 'shared/models';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
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
        rowsPerPageOptions={[5, 10, 25, 50]}
        sortField='time'
        sortOrder={-1}
        tableStyle={{ minWidth: '50rem' }}>
        <Column field='time' header='Дата' sortable />
        <Column field='degree' header='Важность' body={degreeCellTemplate} />
        <Column field='equipment' header='Оборудование' />
        <Column field='message' header='Сообщение' />
        <Column field='executor' header='Ответственный' />
      </DataTable>
    </>
  );
};
