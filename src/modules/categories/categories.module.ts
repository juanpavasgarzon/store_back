import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Category } from './entities/category.entity';
import { CategoryAttribute } from './entities/category-attribute.entity';
import { CategoryService } from './services/category.service';
import { CategoryController } from './controllers/category.controller';
import { CategoryAttributeController } from './controllers/category-attribute.controller';
import { FindCategoryByIdUseCase } from './use-cases/find-category-by-id.use-case';
import { FindCategoryBySlugUseCase } from './use-cases/find-category-by-slug.use-case';
import { CreateCategoryUseCase } from './use-cases/create-category.use-case';
import { UpdateCategoryUseCase } from './use-cases/update-category.use-case';
import { DeleteCategoryUseCase } from './use-cases/delete-category.use-case';
import { ListCategoriesUseCase } from './use-cases/list-categories.use-case';
import { GetCategoryUseCase } from './use-cases/get-category.use-case';
import { ListPublicCategoriesUseCase } from './use-cases/list-public-categories.use-case';
import { ListCategoryAttributesUseCase } from './use-cases/list-category-attributes.use-case';
import { CreateCategoryAttributeUseCase } from './use-cases/create-category-attribute.use-case';
import { UpdateCategoryAttributeUseCase } from './use-cases/update-category-attribute.use-case';
import { DeleteCategoryAttributeUseCase } from './use-cases/delete-category-attribute.use-case';
import { FindCategoryAttributesByCategoryIdUseCase } from './use-cases/find-category-attributes-by-category-id.use-case';

@Module({
  imports: [TypeOrmModule.forFeature([Category, CategoryAttribute])],
  controllers: [CategoryController, CategoryAttributeController],
  providers: [
    CategoryService,
    FindCategoryByIdUseCase,
    FindCategoryBySlugUseCase,
    CreateCategoryUseCase,
    UpdateCategoryUseCase,
    DeleteCategoryUseCase,
    ListCategoriesUseCase,
    GetCategoryUseCase,
    ListPublicCategoriesUseCase,
    ListCategoryAttributesUseCase,
    CreateCategoryAttributeUseCase,
    UpdateCategoryAttributeUseCase,
    DeleteCategoryAttributeUseCase,
    FindCategoryAttributesByCategoryIdUseCase,
  ],
  exports: [CategoryService],
})
export class CategoriesModule {}
