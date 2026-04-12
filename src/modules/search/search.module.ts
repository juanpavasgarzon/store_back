import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Listing } from '../listings/entities/listing.entity';
import { Category } from '../categories/entities/category.entity';
import { SearchController } from './controllers/search.controller';
import { UnifiedSearchUseCase } from './use-cases/unified-search.use-case';

@Module({
  imports: [TypeOrmModule.forFeature([Listing, Category])],
  controllers: [SearchController],
  providers: [UnifiedSearchUseCase],
})
export class SearchModule {}
