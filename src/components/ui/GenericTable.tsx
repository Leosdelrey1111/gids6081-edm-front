import { useCallback, useEffect, useMemo, useState, type ReactNode } from 'react';
import {
  Table, TableHeader, TableColumn, TableBody, TableRow, TableCell,
  Input, Button, Pagination, Dropdown, DropdownTrigger, DropdownMenu, DropdownItem,
  type Selection, type SortDescriptor,
} from '@heroui/react';
import { Icon } from '@iconify/react';
import {
  type ColumnDefinition, type FilterOption, type ItemData,
  DefaultTableConfig, capitalize, getObjectValue, searchInObjectValues,
} from './configs/GenericTableConfigs';

export interface GenericTableProps<T extends ItemData> {
  data: T[];
  columns: ColumnDefinition[];
  filterOptions?: FilterOption[];
  initialVisibleColumns?: string[];
  renderCell?: (item: T, columnKey: string) => ReactNode;
  topContentExtras?: ReactNode;
  defaultRowsPerPage?: number;
  defaultSortColumn?: string;
  defaultSortDirection?: 'ascending' | 'descending';
  disableSorting?: boolean;
  className?: string;
}

export function GenericTable<T extends ItemData>({
  data, columns, filterOptions, initialVisibleColumns, renderCell,
  topContentExtras, defaultRowsPerPage = DefaultTableConfig.rowsPerPage,
  defaultSortColumn, defaultSortDirection = DefaultTableConfig.sortDirection,
  disableSorting = false, className = '',
}: GenericTableProps<T>) {
  const [filterValue, setFilterValue] = useState('');
  const [visibleColumns, setVisibleColumns] = useState<Selection>(new Set(initialVisibleColumns ?? columns.map(c => c.uid)));
  const [statusFilter, setStatusFilter] = useState<Selection>('all');
  const [rowsPerPage, setRowsPerPage] = useState(defaultRowsPerPage);
  const [sortDescriptor, setSortDescriptor] = useState<SortDescriptor>({
    column: defaultSortColumn ?? columns[0]?.uid ?? '',
    direction: defaultSortDirection,
  });
  const [page, setPage] = useState(1);

  const headerColumns = useMemo(() => {
    if (visibleColumns === 'all') return columns;
    return columns.filter(c => (visibleColumns as Set<string>).has(c.uid));
  }, [visibleColumns, columns]);

  const filteredItems = useMemo(() => {
    let result = [...data];
    if (filterValue) result = result.filter(item => searchInObjectValues(item, filterValue, columns, renderCell));
    if (statusFilter !== 'all' && filterOptions) {
      const active = Array.from(statusFilter as Set<string>);
      if (active.length !== filterOptions.length)
        result = result.filter(item => active.includes(String(getObjectValue(item, 'status'))));
    }
    return result;
  }, [data, filterValue, statusFilter, filterOptions, columns, renderCell]);

  const pages = Math.max(1, Math.ceil(filteredItems.length / rowsPerPage));
  useEffect(() => { if (page > pages) setPage(pages); }, [pages, page]);

  const pageItems = useMemo(() => filteredItems.slice((page - 1) * rowsPerPage, page * rowsPerPage), [page, filteredItems, rowsPerPage]);

  const sortedItems = useMemo(() => {
    if (disableSorting) return pageItems;
    return [...pageItems].sort((a, b) => {
      const fa = getObjectValue(a, sortDescriptor.column as string);
      const fb = getObjectValue(b, sortDescriptor.column as string);
      const cmp = fa < fb ? -1 : fa > fb ? 1 : 0;
      return sortDescriptor.direction === 'descending' ? -cmp : cmp;
    });
  }, [sortDescriptor, pageItems, disableSorting]);

  const onSearchChange = useCallback((v: string) => { setFilterValue(v); setPage(1); }, []);
  const onRowsChange = useCallback((e: React.ChangeEvent<HTMLSelectElement>) => { setRowsPerPage(Number(e.target.value)); setPage(1); }, []);
  const onNextPage = useCallback(() => { if (page < pages) setPage(p => p + 1); }, [page, pages]);
  const onPrevPage = useCallback(() => { if (page > 1) setPage(p => p - 1); }, [page]);

  const topContent = useMemo(() => (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-3">
        <Input
          isClearable className="w-full sm:max-w-[40%]" placeholder="Buscar..."
          startContent={<Icon icon="mdi:magnify" width={16} className="text-default-400" />} value={filterValue}
          onClear={() => onSearchChange('')} onValueChange={onSearchChange}
          variant="bordered"
        />
        <div className="flex gap-3 w-full sm:w-auto sm:ml-auto">
          {filterOptions && (
            <Dropdown>
              <DropdownTrigger>
                <Button endContent={<Icon icon="mdi:chevron-down" width={14} />} variant="flat" className="w-full sm:w-auto">Estado</Button>
              </DropdownTrigger>
              <DropdownMenu disallowEmptySelection aria-label="Estado" closeOnSelect={false}
                selectedKeys={statusFilter} selectionMode="multiple" onSelectionChange={setStatusFilter}>
                {filterOptions.map(o => <DropdownItem key={o.uid} className="capitalize">{capitalize(o.name)}</DropdownItem>)}
              </DropdownMenu>
            </Dropdown>
          )}
          {topContentExtras && <div className="flex">{topContentExtras}</div>}
          <Dropdown>
            <DropdownTrigger>
              <Button endContent={<Icon icon="mdi:chevron-down" width={14} />} variant="flat" className="w-full sm:w-auto">Columnas</Button>
            </DropdownTrigger>
            <DropdownMenu disallowEmptySelection aria-label="Columnas" closeOnSelect={false}
              selectedKeys={visibleColumns} selectionMode="multiple" onSelectionChange={setVisibleColumns}>
              {columns.map(c => <DropdownItem key={c.uid} className="capitalize">{typeof c.name === 'string' ? capitalize(c.name) : c.name}</DropdownItem>)}
            </DropdownMenu>
          </Dropdown>
        </div>
      </div>
    </div>
  ), [filterValue, statusFilter, visibleColumns, filterOptions, topContentExtras, columns, onSearchChange]);

  const bottomContent = useMemo(() => (
    <div className="py-4 px-4 flex flex-col sm:flex-row justify-between items-center gap-4 bg-gray-100 dark:bg-zinc-800 rounded-lg shadow-sm border border-gray-200 dark:border-zinc-700">
      <div className="w-full sm:w-auto flex flex-col sm:flex-row items-center gap-4">
        <span className="text-sm text-gray-500 dark:text-gray-400">
          Total: <span className="font-medium text-gray-700 dark:text-gray-200">{data.length}</span>
        </span>
        <div className="flex items-center gap-2">
          <label className="text-sm text-gray-500 dark:text-gray-400">Filas</label>
          <select title="Filas por página" value={rowsPerPage} onChange={onRowsChange}
            className="bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md px-2 py-1 text-sm text-gray-700 dark:text-gray-200 focus:outline-none">
            {[5, 10, 15, 20, 30, 50, 100].map(n => <option key={n} value={n}>{n}</option>)}
          </select>
        </div>
      </div>
      <Pagination isCompact showControls showShadow color="primary" page={page} total={pages} onChange={setPage}
        classNames={{ item: 'bg-transparent dark:bg-transparent', cursor: 'bg-primary-500 dark:bg-primary-600', prev: 'text-gray-700 dark:text-gray-200', next: 'text-gray-700 dark:text-gray-200' }}
      />
    </div>
  ), [filteredItems.length, page, pages, rowsPerPage, onRowsChange, data.length]);

  return (
    <Table isHeaderSticky aria-label="Tabla" bottomContent={bottomContent} bottomContentPlacement="outside"
      topContent={topContent} topContentPlacement="outside"
      sortDescriptor={sortDescriptor} onSortChange={setSortDescriptor} selectionMode="none"
      classNames={{
        wrapper: `max-h-[520px] bg-transparent overflow-x-auto shadow-none border-none ${className}`,
        th: 'text-xs sm:text-sm',
        td: 'text-xs sm:text-sm',
      }}>
      <TableHeader columns={headerColumns}>
        {col => (
          <TableColumn key={col.uid} allowsSorting={!disableSorting && col.sortable} align={col.uid === 'actions' ? 'center' : 'start'}>
            {col.name}
          </TableColumn>
        )}
      </TableHeader>
      <TableBody emptyContent="Sin resultados">
        {sortedItems.map(item => (
          <TableRow key={String(item.id)}>
            {col => (
              <TableCell>
                {renderCell ? renderCell(item, col.toString()) : getObjectValue(item, col.toString())}
              </TableCell>
            )}
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
