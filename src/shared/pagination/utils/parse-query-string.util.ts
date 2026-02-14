import type { PaginationQuery, SortRule } from '../interfaces/pagination-query.interface';

type RawQuery = Record<string, unknown>;

function processFilterValue(value: unknown, operator: string): unknown {
  if (operator === '$in' || operator === '$nin' || operator === '$notIn') {
    if (Array.isArray(value)) {
      return value;
    }
    return String(value)
      .split(',')
      .map((s) => s.trim());
  }
  if (operator === '$gt' || operator === '$gte' || operator === '$lt' || operator === '$lte') {
    const num = Number(value);
    return Number.isNaN(num) ? value : num;
  }
  if (operator === '$null') {
    return value === 'true' || value === true || value === '1';
  }
  return value;
}

function parseFilterKey(
  key: string,
  value: unknown,
  parsed: { filters: Record<string, Record<string, unknown>>; $or?: unknown[]; $and?: unknown[] },
): void {
  const parts: string[] = [];
  const regex = /\[([^\]]+)\]/g;
  let match: RegExpExecArray | null;
  while ((match = regex.exec(key)) !== null) {
    parts.push(match[1]);
  }
  if (parts.length === 0) {
    return;
  }
  if (parts[0] === '$or' || parts[0] === '$and') {
    const logicOp = parts[0];
    const index = parseInt(parts[1], 10);
    if (Number.isNaN(index)) {
      return;
    }
    if (!parsed[logicOp]) {
      parsed[logicOp] = [];
    }
    const arr = parsed[logicOp] as Record<string, unknown>[];
    while (arr.length <= index) {
      arr.push({});
    }
    const fieldPath = parts.slice(2, -1).join('.');
    const operator = parts[parts.length - 1] || '$eq';
    if (!fieldPath) {
      return;
    }
    if (!arr[index][fieldPath]) {
      arr[index][fieldPath] = {};
    }
    const opObj = arr[index][fieldPath] as Record<string, unknown>;
    opObj[operator] = processFilterValue(value, operator);
    return;
  }
  const fieldPath = parts.slice(0, -1).join('.');
  const operator = parts[parts.length - 1] || '$eq';
  if (!fieldPath) {
    return;
  }
  if (!parsed.filters[fieldPath]) {
    parsed.filters[fieldPath] = {};
  }
  parsed.filters[fieldPath][operator] = processFilterValue(value, operator);
}

export function parseSortString(sortStr: string): SortRule[] {
  const normalized = (sortStr ?? '').trim();
  if (!normalized) {
    return [];
  }
  if (normalized.includes(',')) {
    return normalized.split(',').map((s) => {
      const segment = s.trim();
      const isDesc = segment.startsWith('-');
      const fieldPart = isDesc ? segment.substring(1) : segment;
      const [field, order = 'asc'] = fieldPart.split(':');
      return {
        field: field.trim(),
        order: (isDesc ? 'DESC' : order.toUpperCase()) as SortRule['order'],
      };
    });
  }
  const isDesc = normalized.startsWith('-');
  const fieldPart = isDesc ? normalized.substring(1) : normalized;
  const [field, order = 'asc'] = fieldPart.split(':');
  return [
    {
      field: field.trim(),
      order: (isDesc ? 'DESC' : order.toUpperCase()) as SortRule['order'],
    },
  ];
}

export function parseQueryString(rawQuery: RawQuery): PaginationQuery {
  const parsed: PaginationQuery = {
    limit: undefined,
    cursor: undefined,
    search: undefined,
    sort: [],
    filters: {},
  };

  const limitVal = rawQuery.limit;
  if (limitVal != null && limitVal !== '') {
    const n = Number(limitVal);
    if (!Number.isNaN(n)) {
      parsed.limit = n;
    }
  }
  if (typeof rawQuery.cursor === 'string' && rawQuery.cursor !== '') {
    parsed.cursor = rawQuery.cursor;
  }
  if (typeof rawQuery.search === 'string' && rawQuery.search !== '') {
    parsed.search = rawQuery.search;
  }

  const filtersContainer: {
    filters: Record<string, Record<string, unknown>>;
    $or?: Record<string, unknown>[];
    $and?: Record<string, unknown>[];
  } = { filters: parsed.filters as Record<string, Record<string, unknown>> };

  for (const [key, value] of Object.entries(rawQuery)) {
    if (value === undefined || value === null) {
      continue;
    }
    if (key.startsWith('filters[')) {
      parseFilterKey(key, value, filtersContainer);
      continue;
    }
    if (key.startsWith('sort[')) {
      const sortMatch = key.match(/sort\[(\d+)\]\[(\w+)\]/);
      if (sortMatch) {
        const index = parseInt(sortMatch[1], 10);
        const prop = sortMatch[2] as 'field' | 'order';
        if (!parsed.sort) {
          parsed.sort = [];
        }
        while (parsed.sort.length <= index) {
          parsed.sort.push({ field: '', order: 'ASC' });
        }
        if (prop === 'field') {
          parsed.sort[index].field = typeof value === 'string' ? value : '';
        } else {
          parsed.sort[index].order = (
            typeof value === 'string' ? value.toUpperCase() : 'ASC'
          ) as SortRule['order'];
        }
      }
      continue;
    }
    if (key === 'sort' && typeof value === 'string') {
      const hasArraySort = Object.keys(rawQuery).some((k) => k.startsWith('sort['));
      if (!hasArraySort) {
        parsed.sort = parseSortString(value);
      }
    }
  }

  if (filtersContainer.$or?.length) {
    parsed.$or = filtersContainer.$or as Array<Record<string, Record<string, unknown>>>;
  }
  if (filtersContainer.$and?.length) {
    parsed.$and = filtersContainer.$and as Array<Record<string, Record<string, unknown>>>;
  }
  if (parsed.sort?.length === 0) {
    parsed.sort = undefined;
  }
  if (Object.keys(parsed.filters ?? {}).length === 0) {
    parsed.filters = undefined;
  }

  return parsed;
}
