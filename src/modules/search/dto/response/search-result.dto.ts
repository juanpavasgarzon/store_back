import type { SearchType } from '../request/search-query.dto';

export class SearchResultItemDto {
  type: SearchType;
  id: string;
  title: string;
  slug: string | null;

  constructor(type: SearchType, id: string, title: string, slug: string | null) {
    this.type = type;
    this.id = id;
    this.title = title;
    this.slug = slug;
  }
}

export class SearchResultDto {
  data: SearchResultItemDto[];
  total: number;

  constructor(data: SearchResultItemDto[]) {
    this.data = data;
    this.total = data.length;
  }
}
