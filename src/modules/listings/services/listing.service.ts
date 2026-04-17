import { Injectable } from '@nestjs/common';
import { ListMyListingsUseCase } from '../use-cases/list-my-listings.use-case';
import {
  SearchListingsByTermUseCase,
  type ListingSearchResult,
} from '../use-cases/search-listings-by-term.use-case';
import type { Listing } from '../entities/listing.entity';
import type { IUser } from '../../../shared';
import type { PaginationQuery, PaginationResult } from '../../../shared/pagination';

@Injectable()
export class ListingService {
  constructor(
    private readonly listMyListingsUseCase: ListMyListingsUseCase,
    private readonly searchListingsByTermUseCase: SearchListingsByTermUseCase,
  ) {}

  listMyListings(user: IUser, query: PaginationQuery): Promise<PaginationResult<Listing>> {
    return this.listMyListingsUseCase.execute(user, query);
  }

  searchByTerm(term: string): Promise<ListingSearchResult[]> {
    return this.searchListingsByTermUseCase.execute(term);
  }
}
