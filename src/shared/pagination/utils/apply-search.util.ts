import { ObjectLiteral, SelectQueryBuilder } from 'typeorm';
import type { PaginationConfig } from '../interfaces/pagination-config.interface';

export function applySearch<T extends ObjectLiteral>(
  qb: SelectQueryBuilder<T>,
  searchTerm: string | undefined,
  config: PaginationConfig<T>,
): void {
  if (!searchTerm || !config.searchFields || config.searchFields.length === 0) {
    return;
  }
  const mainAlias = qb.expressionMap.mainAlias?.name ?? '';
  const likeOp = config.caseSensitive ? 'LIKE' : 'ILIKE';
  const searchPattern = `%${searchTerm}%`;
  const conditions: string[] = [];
  const params: Record<string, string> = {};

  for (const field of config.searchFields) {
    const fieldStr = String(field);
    const [alias, fieldName] = fieldStr.includes('.') ? fieldStr.split('.') : [mainAlias, fieldStr];
    const paramName = `search_${alias}_${fieldName}`;
    conditions.push(`${alias}.${fieldName} ${likeOp} :${paramName}`);
    params[paramName] = searchPattern;
  }

  if (conditions.length > 0) {
    qb.andWhere(`(${conditions.join(' OR ')})`, params);
  }
}
