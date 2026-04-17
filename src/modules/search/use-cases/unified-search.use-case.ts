import { Injectable } from '@nestjs/common';
import { ListingService } from '../../listings/services/listing.service';
import { CategoryService } from '../../categories/services/category.service';
import { SearchResultItemDto } from '../dto/response/search-result.dto';
import type { SearchType } from '../dto/request/search-query.dto';

@Injectable()
export class UnifiedSearchUseCase {
  constructor(
    private readonly listingService: ListingService,
    private readonly categoryService: CategoryService,
  ) {}

  async execute(query: string, types: SearchType[]): Promise<SearchResultItemDto[]> {
    const results: SearchResultItemDto[] = [];

    if (types.includes('listing')) {
      const listings = await this.listingService.searchByTerm(query);
      for (const listing of listings) {
        results.push(new SearchResultItemDto('listing', listing.id, listing.title, null));
      }
    }

    if (types.includes('category')) {
      const categories = await this.categoryService.searchByTerm(query);
      for (const category of categories) {
        results.push(
          new SearchResultItemDto('category', category.id, category.name, category.slug),
        );
      }
    }

    return results;
  }
}
