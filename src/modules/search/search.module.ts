import { Module } from '@nestjs/common';
import { ListingsModule } from '../listings/listings.module';
import { CategoriesModule } from '../categories/categories.module';
import { SearchController } from './controllers/search.controller';
import { UnifiedSearchUseCase } from './use-cases/unified-search.use-case';

@Module({
  imports: [ListingsModule, CategoriesModule],
  controllers: [SearchController],
  providers: [UnifiedSearchUseCase],
})
export class SearchModule {}
