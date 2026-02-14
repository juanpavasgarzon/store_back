import { ObjectLiteral, SelectQueryBuilder } from 'typeorm';
import type { PaginationQuery } from '../interfaces/pagination-query.interface';
import type { PaginationConfig } from '../interfaces/pagination-config.interface';
import { resolveFieldPath } from './resolve-field-path.util';
import { buildCondition } from './apply-filter-operator.util';

function randomSuffix(): string {
  return Math.random().toString(36).substring(2, 9);
}

export async function applyLogicalOperators<T extends ObjectLiteral>(
  qb: SelectQueryBuilder<T>,
  query: PaginationQuery,
  config: PaginationConfig<T>,
): Promise<void> {
  const metadata = qb.expressionMap.mainAlias?.metadata;
  if (!metadata) {
    return;
  }

  const configCast = config as PaginationConfig<Record<string, unknown>>;

  if (query.$or && Array.isArray(query.$or) && query.$or.length > 0) {
    const orConditions: string[] = [];
    const orParams: Record<string, unknown> = {};
    for (const orGroup of query.$or) {
      const groupConditions: string[] = [];
      for (const [fieldPath, operations] of Object.entries(orGroup)) {
        const resolved = resolveFieldPath(qb, fieldPath, metadata, config);
        if (!resolved) {
          continue;
        }

        for (const [operator, value] of Object.entries(operations)) {
          const paramName = `or_${resolved.alias}_${resolved.field}_${randomSuffix()}`;
          const condition = buildCondition(
            resolved.alias,
            resolved.field,
            operator,
            paramName,
            value,
            configCast,
          );
          if (condition) {
            groupConditions.push(condition.sql);
            Object.assign(orParams, condition.params);
          }
        }
      }

      if (groupConditions.length > 0) {
        orConditions.push(`(${groupConditions.join(' AND ')})`);
      }
    }

    if (orConditions.length > 0) {
      qb.andWhere(`(${orConditions.join(' OR ')})`, orParams);
    }
  }

  if (query.$and && Array.isArray(query.$and) && query.$and.length > 0) {
    for (const andGroup of query.$and) {
      const andConditions: string[] = [];
      const andParams: Record<string, unknown> = {};
      for (const [fieldPath, operations] of Object.entries(andGroup)) {
        const resolved = resolveFieldPath(qb, fieldPath, metadata, config);
        if (!resolved) {
          continue;
        }

        for (const [operator, value] of Object.entries(operations)) {
          const paramName = `and_${resolved.alias}_${resolved.field}_${randomSuffix()}`;
          const condition = buildCondition(
            resolved.alias,
            resolved.field,
            operator,
            paramName,
            value,
            configCast,
          );
          if (condition) {
            andConditions.push(condition.sql);
            Object.assign(andParams, condition.params);
          }
        }
      }

      if (andConditions.length > 0) {
        qb.andWhere(`(${andConditions.join(' AND ')})`, andParams);
      }
    }
  }
}
