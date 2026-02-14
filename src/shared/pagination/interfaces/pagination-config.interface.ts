export interface SortRuleConfig {
  field: string;
  order: 'ASC' | 'DESC';
}

export interface PaginationConfig<T = Record<string, unknown>> {
  searchFields?: (keyof T | string)[];
  defaultSort?: SortRuleConfig[];
  allowedFilters?: (keyof T | string)[];
  deniedFilters?: (keyof T | string)[];
  allowedOperators?: string[];
  maxFilterDepth?: number;
  autoJoin?: boolean;
  joinType?: 'left' | 'inner';
  throwOnInvalidFilter?: boolean;
  caseSensitive?: boolean;
  defaultLimit?: number;
  maxLimit?: number;
}
