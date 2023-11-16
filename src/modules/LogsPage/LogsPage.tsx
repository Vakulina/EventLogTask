import { useEffect, useRef, useState } from 'react';
import { generateDataService } from 'services/generateDataService';
import {
  DataTable,
  DataTableSelectionSingleChangeEvent,
} from 'primereact/datatable';
import { Column, ColumnFilterElementTemplateOptions } from 'primereact/column';
import {
  degreeCellTemplate,
  executorFilterItemTemplate,
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
import { Card } from 'shared/components/Card';
import { DataViewCardsContext } from 'shared/components/DataViewCardsContext';
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
      if (e instanceof KeyboardEvent && e.code === 'Space') {
        e.preventDefault();
        onKeyDown();
      }
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
    <div className='flex flex-col justify-start gap-3 h-screen w-full box-border py-5 '>
      <div className='flex justify-between'>
        <SelectButton
          value={pageFormat}
          onChange={(e) => {
            if (e.value) setPageFormat(e.value);
          }}
          options={['Таблица', 'Карточки']}
          unstyled={false}
          pt={{
            button: {
              className: 'px-2 py-1 font-normal',
            },
          }}
        />
        {pageFormat === 'Таблица' && (
          <InputText
            value={filters.global.value}
            onChange={(e) => onGlobalFilterChange('global', e?.target?.value)}
            placeholder='Поиск'
            className='p-inputtext-sm px-2 py-1'
          />
        )}
      </div>

      {pageFormat === 'Таблица' && (
        <DataTable
          filters={filters}
          value={logs}
          rowClassName={rowClass}
          showGridlines
          paginator
          rows={5}
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
            className='w-[10%] sm:text-sm xs:p-1.5 xs:text-xs'
            headerClassName='w-[10%] sm:text-sm xs:p-1.5 xs:p-1.5 xs:text-xs'
            sortable
          />
          <Column
            field='degree'
            header='Важность'
            headerClassName='sm:text-sm xs:p-1.5 xs:text-xs'
            bodyClassName='sm:text-sm xs:p-1.5 xs:text-xs'
            body={degreeCellTemplate}
            className='w-24'
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
            headerClassName='sm:text-sm xs:p-1.5 xs:text-xs'
            bodyClassName='sm:text-sm xs:p-1.5 xs:text-xs'
          />
          <Column
            field='message'
            header='Сообщение'
            style={{ width: '28%' }}
            headerClassName='sm:text-sm xs:p-1.5 xs:text-xs'
            bodyClassName='sm:text-sm xs:p-1.5 xs:text-xs'
          />
          <Column
            field='executor'
            header='Ответственный'
            style={{ width: '22%' }}
            headerClassName='sm:text-sm sm:p-1.5 xs:text-xs sm:p-1.5'
            bodyClassName='sm:text-sm sm:p-1.5s  xs:text-xs xs:text-x'
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
        <DataViewCardsContext.Provider
          value={{
            setSelectedLog,
            selectedLog,
          }}>
          <DataView
            emptyMessage='Событий не найдено'
            value={logs}
            itemTemplate={(event: EventType) => <Card event={event} />}
            layout={'grid'}
            paginator
            rows={9}
            pt={{
              grid: {
                className:
                  'grid-cols-2 gap-5 xs:grid-cols-1 sm:grid-cols-2  lg:grid-cols-2 xl:grid-cols-3 p-2 height-[80vh]',
              },
            }}
          />
        </DataViewCardsContext.Provider>
      )}
    </div>
  );
};
