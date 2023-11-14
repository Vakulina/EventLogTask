import { useEffect, useRef, useState } from 'react';
import { generateDataService } from 'services/generateDataService';
import {
  DataTable,
  DataTableSelectionSingleChangeEvent,
} from 'primereact/datatable';
import { Column, ColumnFilterElementTemplateOptions } from 'primereact/column';
import './LogsPage.scss';
import {
  degreeCellTemplate,
  executorFilterItemTemplate,
  getDegreeTag,
  getExecutorsList,
  prepareLog,
  rowClass,
} from './utils';
import { EventType } from 'shared/types/Events';
import { useInterval, useEventListener } from 'primereact/hooks';
import { InputText } from 'primereact/inputtext';
import { FilterMatchMode } from 'primereact/api';
import { Dropdown } from 'primereact/dropdown';
import { PrimeIcons } from 'primereact/api';
import { MultiSelect } from 'primereact/multiselect';
import { SelectButton } from 'primereact/selectbutton';
import { DataView } from 'primereact/dataview';
import { Tag } from 'primereact/tag';
import { Card } from 'shared/components/Card';
type DeegreeType = 'Высокая' | 'Критическая' | 'Низкая';
type PageFormat = 'Таблица' | 'Карточки';

type FilterType = {
  global: { value: string; matchMode: FilterMatchMode.CONTAINS };
  degree: { value: DeegreeType | null; matchMode: FilterMatchMode };
  executor: { value: ''; matchMode: FilterMatchMode };
};

export const LogsPage = () => {
  const [pageFormat, setPageFormat] = useState<PageFormat>('Таблица');
  const [logs, setLogs] = useState<EventType[]>([]);
  const [messagesCount, setMessagesCount] = useState<number>(0);
  const [selectedLog, setSelectedLog] = useState<null | EventType>(null);

  const [filters, setFilters] = useState<FilterType>({
    global: { value: '', matchMode: FilterMatchMode.CONTAINS },
    degree: { value: null, matchMode: FilterMatchMode.EQUALS },
    executor: { value: '', matchMode: FilterMatchMode.IN },
  });
  const [statuses] = useState(['Высокая', 'Критическая', 'Низкая']);

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
    statuses;
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

  const onGlobalFilterChange = (
    type: 'global' | 'degree' | 'executor',
    value: string
  ) => {
    let _filters = { ...filters };
    _filters[type].value = value;
    setFilters(_filters);
  };

  const degreeRowFilterTemplate = (
    options: ColumnFilterElementTemplateOptions
  ) => {
    const { field, value } = options;
    return (
      <Dropdown
        value={value}
        options={statuses}
        onChange={(e) =>
          onGlobalFilterChange(field as 'degree', e.target.value)
        }
        placeholder='важность'
        style={{ minWidth: '12rem' }}
        showClear
      />
    );
  };

  const executorRowFilterTemplate = (
    options: ColumnFilterElementTemplateOptions
  ) => {
    const { field, value } = options;
    return (
      <MultiSelect
        value={value}
        options={getExecutorsList(logs)}
        itemTemplate={executorFilterItemTemplate}
        onChange={(e) =>
          onGlobalFilterChange(field as 'executor', e.target.value)
        }
        placeholder='Ответственный'
        style={{ minWidth: '250px', maxWidth: '250px' }}
        showClear
        filter
        panelStyle={{ maxWidth: '290px' }}
        showSelectAll={false}
        closeIcon={PrimeIcons.TIMES}
      />
    );
  };


  return (
    <div className='logs'>
      <div className='logs__header'>
        <InputText
          value={filters.global.value}
          onChange={(e) => onGlobalFilterChange('global', e?.target?.value)}
          placeholder='Поиск'
        />

        <SelectButton
          value={pageFormat}
          onChange={(e) => setPageFormat(e.value)}
          options={['Таблица', 'Карточки']}
        />
      </div>

      {pageFormat === 'Таблица' && (
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
          tableStyle={{ width: '100%' }}
          emptyMessage='Событий не найдено'
          selection={selectedLog}
          onSelectionChange={onSelectionChange}
          dataKey='id'
          selectionMode='single'
          metaKeySelection={true}
          style={{
            minHeight: '80vh',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            border: '1px solid LightGray',
          }}
          filterIcon={PrimeIcons.FILTER}>
          <Column
            field='time'
            header='Дата'
            style={{ width: '10%' }}
            sortable
          />
          <Column
            field='degree'
            header='Важность'
            body={degreeCellTemplate}
            style={{ width: '20%' }}
            filter
            showFilterMenu
            filterElement={degreeRowFilterTemplate}
            showFilterMatchModes={false}
            showAddButton={false}
            showApplyButton={false}
            showClearButton={false}
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
            filter
            showFilterMenu
            filterElement={executorRowFilterTemplate}
            showFilterMatchModes={false}
            showAddButton={false}
            showApplyButton={false}
            showClearButton={false}
          />
        </DataTable>
      )}
      {pageFormat === 'Карточки' && (
        <DataView
          value={logs}
          itemTemplate={(event:EventType) => <Card event ={event}/>}
          layout={'grid'}
          pt={{
            grid: { className: 'surface-ground' },
          }}
        />
      )}
    </div>
  );
};
