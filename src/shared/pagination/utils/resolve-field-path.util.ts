import type { ObjectLiteral } from 'typeorm';
import type { EntityMetadata, SelectQueryBuilder } from 'typeorm';
import type { PaginationConfig } from '../interfaces/pagination-config.interface';

export interface ResolvedField {
  alias: string;
  field: string;
}

export function resolveFieldPath<T extends ObjectLiteral>(
  qb: SelectQueryBuilder<T>,
  fieldPath: string,
  rootMetadata: EntityMetadata,
  config: PaginationConfig<T>,
): ResolvedField | null {
  const parts = fieldPath.split('.');
  const mainAlias = qb.expressionMap.mainAlias?.name;
  if (!mainAlias) {
    return null;
  }

  if (parts.length === 1) {
    const column = rootMetadata.findColumnWithPropertyName(parts[0]);
    if (!column) {
      return null;
    }
    return { alias: mainAlias, field: parts[0] };
  }

  let currentMetadata: EntityMetadata = rootMetadata;
  let currentAlias = mainAlias;
  const relationPath: string[] = [];

  for (let i = 0; i < parts.length - 1; i++) {
    const relationName = parts[i];
    relationPath.push(relationName);

    const relation = currentMetadata.relations.find((r) => r.propertyName === relationName);
    if (!relation) {
      return null;
    }

    const joinAlias = relationPath.join('_');
    const existingJoin = qb.expressionMap.joinAttributes.find((j) => j.alias?.name === joinAlias);

    if (!existingJoin && config.autoJoin !== false) {
      const joinPath = `${currentAlias}.${relationName}`;
      if (config.joinType === 'inner') {
        qb.innerJoin(joinPath, joinAlias);
      } else {
        qb.leftJoin(joinPath, joinAlias);
      }
    }

    currentAlias = joinAlias;
    currentMetadata = relation.inverseEntityMetadata;
  }

  const fieldName = parts[parts.length - 1];
  const column = currentMetadata.findColumnWithPropertyName(fieldName);
  if (!column) {
    return null;
  }

  return { alias: currentAlias, field: fieldName };
}
