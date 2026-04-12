import { ObjectLiteral, SelectQueryBuilder } from 'typeorm';
import { SortOrder } from '../constants/sort-order';
import type { PaginationQuery } from '../interfaces/pagination-query.interface';
import type { PaginationConfig } from '../interfaces/pagination-config.interface';

export interface PrimarySort {
  sortBy: string;
  sortOrder: SortOrder;
}

export function applySort<T extends ObjectLiteral>(
  qb: SelectQueryBuilder<T>,
  query: PaginationQuery,
  config: PaginationConfig<T>,
): PrimarySort | null {
  const mainAlias = qb.expressionMap.mainAlias?.name;
  if (!mainAlias) {
    return null;
  }
  const sortRules =
    query.sort && query.sort.length > 0
      ? query.sort
      : (config.defaultSort ?? [{ field: 'id', order: 'ASC' }]);

  sortRules.forEach((rule, index) => {
    const fieldStr = String(rule.field);
    const alias = fieldStr.includes('.') ? fieldStr.slice(0, fieldStr.indexOf('.')) : mainAlias;
    const fieldName = fieldStr.includes('.') ? fieldStr.slice(fieldStr.indexOf('.') + 1) : fieldStr;
    const fullField = `${alias}.${fieldName}`;
    const order = (rule.order?.toString().toUpperCase() ?? 'ASC') as 'ASC' | 'DESC';
    if (index === 0) {
      qb.orderBy(fullField, order);
      return;
    }
    qb.addOrderBy(fullField, order);
  });

  const primary = sortRules[0];
  const primaryFieldStr = String(primary.field);
  const dotIdx = primaryFieldStr.indexOf('.');
  const primaryFieldName = dotIdx >= 0 ? primaryFieldStr.slice(dotIdx + 1) : primaryFieldStr;
  const orderStr = primary.order?.toString().toUpperCase() ?? 'ASC';
  return {
    sortBy: primaryFieldName,
    sortOrder: orderStr === 'DESC' ? SortOrder.DESC : SortOrder.ASC,
  };
}
