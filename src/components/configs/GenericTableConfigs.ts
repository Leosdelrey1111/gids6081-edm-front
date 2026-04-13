import type { ReactNode } from 'react';

export type ColumnDefinition = { name: string | ReactNode; uid: string; sortable?: boolean; };
export type FilterOption = { name: string; uid: string; };
export type ItemData = { id: string | number; [key: string]: any; };

export const DefaultTableConfig = { rowsPerPage: 10, sortDirection: 'ascending' as const, hideSelection: true } as const;

export function capitalize(s: string): string {
  return s ? s.charAt(0).toUpperCase() + s.slice(1).toLowerCase() : '';
}

export function findObjectKey(obj: any, searchKey: string): string {
  if (Object.prototype.hasOwnProperty.call(obj, searchKey)) return searchKey;
  const found = Object.keys(obj).find(k => k.toLowerCase() === searchKey.toLowerCase());
  return found || searchKey;
}

export function getObjectValue(obj: any, columnKey: string): any {
  return obj[findObjectKey(obj, columnKey)] ?? '';
}

export function searchInObjectValues(obj: any, term: string, columns: ColumnDefinition[], renderCell?: (item: any, key: string) => ReactNode): boolean {
  const lower = term.toLowerCase();
  return columns.some(col => {
    let value: any;
    if (renderCell) {
      try {
        const r = renderCell(obj, col.uid);
        value = (typeof r === 'string' || typeof r === 'number') ? String(r) : getObjectValue(obj, col.uid);
      } catch { value = getObjectValue(obj, col.uid); }
    } else { value = getObjectValue(obj, col.uid); }
    return String(value).toLowerCase().includes(lower);
  });
}
