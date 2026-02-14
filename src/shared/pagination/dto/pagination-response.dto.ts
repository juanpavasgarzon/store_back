import type { PaginationMeta } from '../interfaces/pagination-meta.interface';

export class PaginationResponse<T> {
  data: T[];
  meta: PaginationMeta;

  constructor(data: T[], meta: PaginationMeta) {
    this.data = data;
    this.meta = meta;
  }
}
