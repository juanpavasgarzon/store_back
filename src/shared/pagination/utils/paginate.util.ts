import { ObjectLiteral, SelectQueryBuilder } from 'typeorm';
import type { PaginationResult } from '../interfaces/pagination-result.interface';
import type { PaginationQuery } from '../interfaces/pagination-query.interface';
import type { PaginationConfig } from '../interfaces/pagination-config.interface';
import { SortOrder } from '../constants/sort-order';
import { decodeCursor } from './cursor.utils';
import { encodePage, decodeSortValue } from './cursor-page.utils';
import { applyFilters } from './apply-filters.util';
import { applyLogicalOperators } from './apply-logical-operators.util';
import { applySearch } from './apply-search.util';
import { applySort } from './apply-sort.util';

export async function paginate<T extends ObjectLiteral>(
  qb: SelectQueryBuilder<T>,
  query: PaginationQuery,
  config: PaginationConfig<T>,
): Promise<PaginationResult<T>> {
  const finalConfig: PaginationConfig<T> = {
    autoJoin: config.autoJoin !== false,
    joinType: config.joinType ?? 'left',
    throwOnInvalidFilter: config.throwOnInvalidFilter ?? false,
    caseSensitive: config.caseSensitive ?? false,
    defaultLimit: config.defaultLimit ?? 20,
    maxLimit: config.maxLimit ?? 100,
    ...config,
  };

  const limit = Math.min(
    query.limit ?? finalConfig.defaultLimit ?? 20,
    finalConfig.maxLimit ?? 100,
  );
  const workingQb = qb.clone();
  const metadata = workingQb.expressionMap.mainAlias?.metadata;

  if (!metadata) {
    const empty = await qb.take(limit + 1).getMany();
    const data = empty.slice(0, limit);
    return {
      data,
      meta: {
        hasNextPage: empty.length > limit,
        hasPreviousPage: false,
        nextCursor: null,
        previousCursor: null,
        limit,
      },
    };
  }

  applyFilters(workingQb, query.filters, finalConfig);
  await applyLogicalOperators(workingQb, query, finalConfig);
  applySearch(workingQb, query.search, finalConfig);

  const sortResult = applySort(workingQb, query, finalConfig);
  const hasSort = sortResult != null;
  const mainAlias = workingQb.expressionMap.mainAlias?.name ?? '';
  const sortBy = sortResult?.sortBy ?? 'id';
  const sortOrder = sortResult?.sortOrder ?? SortOrder.ASC;

  if (hasSort) {
    workingQb.addOrderBy(`${mainAlias}.id`, sortOrder);
  }

  let cursorId: string | undefined;
  let cursorValue: string | number | Date | undefined;
  if (hasSort && query.cursor) {
    const decoded = decodeCursor(query.cursor);
    if (decoded) {
      cursorId = decoded.id;
      cursorValue = decodeSortValue(decoded.sortValue);
    }
  }

  if (hasSort && cursorId != null && cursorValue !== undefined) {
    const op = sortOrder === SortOrder.DESC ? '<' : '>';
    workingQb.andWhere(
      `(${mainAlias}.${sortBy} ${op} :cursorValue OR (${mainAlias}.${sortBy} = :cursorValue AND ${mainAlias}.id ${op} :cursorId))`,
      { cursorValue, cursorId },
    );
  }

  workingQb.take(limit + 1);
  const items = await workingQb.getMany();
  const hasNextPage = items.length > limit;
  const data = hasNextPage ? items.slice(0, limit) : items;
  const last = data[data.length - 1];
  const first = data[0];

  let nextCursor: string | null = null;
  let previousCursor: string | null = null;
  if (hasSort && last != null && first != null) {
    const sortByKey = sortBy as keyof T;
    nextCursor = hasNextPage && last ? encodePage(sortByKey, last) : null;
    previousCursor = query.cursor && first ? encodePage(sortByKey, first) : null;
  }

  return {
    data,
    meta: {
      hasNextPage,
      hasPreviousPage: !!query.cursor && hasSort,
      nextCursor,
      previousCursor,
      limit,
    },
  };
}
