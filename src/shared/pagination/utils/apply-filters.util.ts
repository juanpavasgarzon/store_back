import { ObjectLiteral, SelectQueryBuilder } from 'typeorm';
import type { PaginationConfig } from '../interfaces/pagination-config.interface';
import { resolveFieldPath } from './resolve-field-path.util';
import { applyFilterOperator } from './apply-filter-operator.util';

export function isFilterAllowed<T>(fieldPath: string, config: PaginationConfig<T>): boolean {
  if (config.deniedFilters?.includes(fieldPath as keyof T & string)) {
    return false;
  }
  if (config.allowedFilters && config.allowedFilters.length > 0) {
    return config.allowedFilters.includes(fieldPath as keyof T & string);
  }
  if (config.maxFilterDepth != null) {
    const depth = fieldPath.split('.').length - 1;
    if (depth > config.maxFilterDepth) {
      return false;
    }
  }
  return true;
}

export function applyFilters<T extends ObjectLiteral>(
  qb: SelectQueryBuilder<T>,
  filters: Record<string, Record<string, unknown>> | undefined,
  config: PaginationConfig<T>,
): void {
  if (!filters || Object.keys(filters).length === 0) {
    return;
  }
  const metadata = qb.expressionMap.mainAlias?.metadata;
  if (!metadata) {
    return;
  }
  for (const [fieldPath, operations] of Object.entries(filters)) {
    if (!isFilterAllowed(fieldPath, config)) {
      if (config.throwOnInvalidFilter) {
        throw new Error(`Filter on '${fieldPath}' is not allowed`);
      }
      continue;
    }
    const resolved = resolveFieldPath(qb, fieldPath, metadata, config);
    if (!resolved) {
      if (config.throwOnInvalidFilter) {
        throw new Error(`Field '${fieldPath}' not found`);
      }
      continue;
    }
    for (const [operator, value] of Object.entries(operations)) {
      if (config.allowedOperators && config.allowedOperators.length > 0) {
        if (!config.allowedOperators.includes(operator)) {
          if (config.throwOnInvalidFilter) {
            throw new Error(`Operator '${operator}' is not allowed`);
          }
          continue;
        }
      }
      applyFilterOperator(
        qb,
        resolved.alias,
        resolved.field,
        operator,
        value,
        config as PaginationConfig,
      );
    }
  }
}
