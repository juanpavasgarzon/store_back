import type { ObjectLiteral, SelectQueryBuilder } from 'typeorm';
import type { BuiltCondition } from '../interfaces/built-condition.interface';
import type { PaginationConfig } from '../interfaces/pagination-config.interface';

function randomParamSuffix(): string {
  return Math.random().toString(36).substring(2, 9);
}

export function applyFilterOperator<T extends ObjectLiteral>(
  qb: SelectQueryBuilder<T>,
  alias: string,
  field: string,
  operator: string,
  value: unknown,
  config: PaginationConfig,
): void {
  const paramName = `${alias}_${field}_${operator.replace('$', '')}_${randomParamSuffix()}`;
  const fullField = `${alias}.${field}`;
  const likeOp = config.caseSensitive ? 'LIKE' : 'ILIKE';

  switch (operator) {
    case '$eq':
      qb.andWhere(`${fullField} = :${paramName}`, { [paramName]: value });
      break;
    case '$ne':
    case '$neq':
      qb.andWhere(`${fullField} != :${paramName}`, { [paramName]: value });
      break;
    case '$gt':
      qb.andWhere(`${fullField} > :${paramName}`, { [paramName]: value });
      break;
    case '$gte':
      qb.andWhere(`${fullField} >= :${paramName}`, { [paramName]: value });
      break;
    case '$lt':
      qb.andWhere(`${fullField} < :${paramName}`, { [paramName]: value });
      break;
    case '$lte':
      qb.andWhere(`${fullField} <= :${paramName}`, { [paramName]: value });
      break;
    case '$in': {
      const inValues = Array.isArray(value) ? value : String(value).split(',');
      if (inValues.length > 0) {
        qb.andWhere(`${fullField} IN (:...${paramName})`, { [paramName]: inValues });
      }
      break;
    }
    case '$nin':
    case '$notIn': {
      const ninValues = Array.isArray(value) ? value : String(value).split(',');
      if (ninValues.length > 0) {
        qb.andWhere(`${fullField} NOT IN (:...${paramName})`, { [paramName]: ninValues });
      }
      break;
    }
    case '$contains':
      qb.andWhere(`${fullField} ${likeOp} :${paramName}`, {
        [paramName]: `%${String(value)}%`,
      });
      break;
    case '$notContains':
      qb.andWhere(`${fullField} NOT ${likeOp} :${paramName}`, {
        [paramName]: `%${String(value)}%`,
      });
      break;
    case '$startsWith':
      qb.andWhere(`${fullField} ${likeOp} :${paramName}`, {
        [paramName]: `${String(value)}%`,
      });
      break;
    case '$endsWith':
      qb.andWhere(`${fullField} ${likeOp} :${paramName}`, {
        [paramName]: `%${String(value)}`,
      });
      break;
    case '$containsi':
      qb.andWhere(`${fullField} LIKE :${paramName}`, {
        [paramName]: `%${String(value)}%`,
      });
      break;
    case '$null':
      if (value === true || value === 'true' || value === '1') {
        qb.andWhere(`${fullField} IS NULL`);
        break;
      }
      qb.andWhere(`${fullField} IS NOT NULL`);
      break;
    case '$between':
      if (Array.isArray(value) && value.length === 2) {
        qb.andWhere(`${fullField} BETWEEN :${paramName}Min AND :${paramName}Max`, {
          [`${paramName}Min`]: value[0],
          [`${paramName}Max`]: value[1],
        });
      }
      break;
    case '$notBetween':
      if (Array.isArray(value) && value.length === 2) {
        qb.andWhere(`${fullField} NOT BETWEEN :${paramName}Min AND :${paramName}Max`, {
          [`${paramName}Min`]: value[0],
          [`${paramName}Max`]: value[1],
        });
      }
      break;
    default:
      if (config.throwOnInvalidFilter) {
        throw new Error(`Unknown operator: ${operator}`);
      }
  }
}

export function buildCondition(
  alias: string,
  field: string,
  operator: string,
  paramName: string,
  value: unknown,
  config: PaginationConfig,
): BuiltCondition | null {
  const fullField = `${alias}.${field}`;
  const likeOp = config.caseSensitive ? 'LIKE' : 'ILIKE';

  switch (operator) {
    case '$eq':
      return { sql: `${fullField} = :${paramName}`, params: { [paramName]: value } };
    case '$ne':
    case '$neq':
      return { sql: `${fullField} != :${paramName}`, params: { [paramName]: value } };
    case '$gt':
      return { sql: `${fullField} > :${paramName}`, params: { [paramName]: value } };
    case '$gte':
      return { sql: `${fullField} >= :${paramName}`, params: { [paramName]: value } };
    case '$lt':
      return { sql: `${fullField} < :${paramName}`, params: { [paramName]: value } };
    case '$lte':
      return { sql: `${fullField} <= :${paramName}`, params: { [paramName]: value } };
    case '$in': {
      const inValues = Array.isArray(value) ? value : String(value).split(',');
      if (inValues.length === 0) {
        return null;
      }
      return { sql: `${fullField} IN (:...${paramName})`, params: { [paramName]: inValues } };
    }
    case '$nin':
    case '$notIn': {
      const ninValues = Array.isArray(value) ? value : String(value).split(',');
      if (ninValues.length === 0) {
        return null;
      }
      return { sql: `${fullField} NOT IN (:...${paramName})`, params: { [paramName]: ninValues } };
    }
    case '$contains':
      return {
        sql: `${fullField} ${likeOp} :${paramName}`,
        params: { [paramName]: `%${String(value)}%` },
      };
    case '$null':
      if (value === true || value === 'true' || value === '1') {
        return { sql: `${fullField} IS NULL`, params: {} };
      }
      return { sql: `${fullField} IS NOT NULL`, params: {} };

    default:
      return null;
  }
}
