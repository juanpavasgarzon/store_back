import type { ObjectLiteral } from 'typeorm';
import { encodeCursor } from './cursor.utils';

export function getSortValue<T extends ObjectLiteral>(
  sortBy: keyof T,
  item: T,
): string | number | Date {
  const value = item[sortBy];
  if (value == null || typeof value === 'boolean') {
    return item.id as string;
  }
  return value as string | number | Date;
}

export function encodePage<T extends ObjectLiteral>(
  sortBy: keyof T,
  item: T | null | undefined,
): string | null {
  if (item == null) {
    return null;
  }
  return encodeCursor({ id: item.id, sortValue: getSortValue(sortBy, item) });
}

export function decodeSortValue(sortValue: string | number | Date): string | number | Date {
  if (typeof sortValue === 'string' && sortValue.length >= 10) {
    return new Date(sortValue);
  }
  return sortValue;
}
