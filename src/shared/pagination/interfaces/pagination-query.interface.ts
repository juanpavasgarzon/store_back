export type SortOrderValue = 'asc' | 'desc' | 'ASC' | 'DESC';

export interface SortRule {
  field: string;
  order: SortOrderValue;
}

export interface PaginationQuery {
  limit?: number;
  cursor?: string;
  search?: string;
  sort?: SortRule[];
  filters?: Record<string, Record<string, unknown>>;
  $or?: Array<Record<string, Record<string, unknown>>>;
  $and?: Array<Record<string, Record<string, unknown>>>;
}
