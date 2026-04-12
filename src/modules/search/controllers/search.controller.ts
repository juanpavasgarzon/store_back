import { Controller, Get, HttpCode, HttpStatus, Query } from '@nestjs/common';
import { Public } from '../../../shared';
import { UnifiedSearchUseCase } from '../use-cases/unified-search.use-case';
import { SearchQueryDto } from '../dto/request/search-query.dto';
import { SearchResultDto } from '../dto/response/search-result.dto';

@Controller('search')
export class SearchController {
  constructor(private readonly unifiedSearchUseCase: UnifiedSearchUseCase) {}

  @Public()
  @Get()
  @HttpCode(HttpStatus.OK)
  async search(@Query() query: SearchQueryDto): Promise<SearchResultDto> {
    const results = await this.unifiedSearchUseCase.execute(query.q, query.types);
    return new SearchResultDto(results);
  }
}
