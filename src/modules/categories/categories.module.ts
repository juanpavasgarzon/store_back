import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Category } from './entities/category.entity';
import { CategoryVariant } from './entities/category-variant.entity';
import { CategoryService } from './services/category.service';
import { CategoryController } from './controllers/category.controller';
import { VariantController } from './controllers/variant.controller';
import { FindCategoryByIdUseCase } from './use-cases/find-category-by-id.use-case';
import { FindCategoryBySlugUseCase } from './use-cases/find-category-by-slug.use-case';
import { FindCategoryVariantByIdUseCase } from './use-cases/find-category-variant-by-id.use-case';
import { FindCategoryVariantsByCategoryIdUseCase } from './use-cases/find-category-variants-by-category-id.use-case';
import { FindCategoryVariantByCategoryIdAndKeyUseCase } from './use-cases/find-category-variant-by-category-id-and-key.use-case';
import { CreateCategoryUseCase } from './use-cases/create-category.use-case';
import { UpdateCategoryUseCase } from './use-cases/update-category.use-case';
import { DeleteCategoryUseCase } from './use-cases/delete-category.use-case';
import { ListCategoriesUseCase } from './use-cases/list-categories.use-case';
import { GetCategoryUseCase } from './use-cases/get-category.use-case';
import { ListPublicCategoriesUseCase } from './use-cases/list-public-categories.use-case';
import { CreateCategoryVariantUseCase } from './use-cases/create-category-variant.use-case';
import { UpdateCategoryVariantUseCase } from './use-cases/update-category-variant.use-case';
import { DeleteCategoryVariantUseCase } from './use-cases/delete-category-variant.use-case';
import { ListVariantsByCategoryUseCase } from './use-cases/list-variants-by-category.use-case';

@Module({
  imports: [TypeOrmModule.forFeature([Category, CategoryVariant])],
  controllers: [CategoryController, VariantController],
  providers: [
    CategoryService,
    FindCategoryByIdUseCase,
    FindCategoryBySlugUseCase,
    FindCategoryVariantByIdUseCase,
    FindCategoryVariantsByCategoryIdUseCase,
    FindCategoryVariantByCategoryIdAndKeyUseCase,
    CreateCategoryUseCase,
    UpdateCategoryUseCase,
    DeleteCategoryUseCase,
    ListCategoriesUseCase,
    GetCategoryUseCase,
    ListPublicCategoriesUseCase,
    CreateCategoryVariantUseCase,
    UpdateCategoryVariantUseCase,
    DeleteCategoryVariantUseCase,
    ListVariantsByCategoryUseCase,
  ],
  exports: [CategoryService, FindCategoryVariantByIdUseCase],
})
export class CategoriesModule {}
