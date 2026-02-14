import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  Query,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { Public, RequirePermissions } from '../../../shared';
import { PERMISSIONS } from '../../../shared/security';
import {
  PaginationResponse,
  ParsePaginationQueryPipe,
  PaginationRequest,
} from '../../../shared/pagination';
import { CreateCategoryUseCase } from '../use-cases/create-category.use-case';
import { UpdateCategoryUseCase } from '../use-cases/update-category.use-case';
import { DeleteCategoryUseCase } from '../use-cases/delete-category.use-case';
import { ListCategoriesUseCase } from '../use-cases/list-categories.use-case';
import { GetCategoryUseCase } from '../use-cases/get-category.use-case';
import { ListPublicCategoriesUseCase } from '../use-cases/list-public-categories.use-case';
import { CreateCategoryRequest } from '../dto/request/create-category.dto';
import { UpdateCategoryRequest } from '../dto/request/update-category.dto';
import { CategoryResponse } from '../dto/response/category-response.dto';

@Controller('categories')
export class CategoryController {
  constructor(
    private readonly createCategoryUseCase: CreateCategoryUseCase,
    private readonly updateCategoryUseCase: UpdateCategoryUseCase,
    private readonly deleteCategoryUseCase: DeleteCategoryUseCase,
    private readonly listCategoriesUseCase: ListCategoriesUseCase,
    private readonly getCategoryUseCase: GetCategoryUseCase,
    private readonly listPublicCategoriesUseCase: ListPublicCategoriesUseCase,
  ) {}

  @Public()
  @Get('public')
  @HttpCode(HttpStatus.OK)
  async listPublic(): Promise<CategoryResponse[]> {
    const list = await this.listPublicCategoriesUseCase.execute();
    return list.map((c) => new CategoryResponse(c));
  }

  @RequirePermissions(PERMISSIONS.CATEGORIES_READ)
  @Get()
  @HttpCode(HttpStatus.OK)
  async list(
    @Query(ParsePaginationQueryPipe) query: PaginationRequest,
  ): Promise<PaginationResponse<CategoryResponse>> {
    const result = await this.listCategoriesUseCase.execute(query);
    return new PaginationResponse(
      result.data.map((c) => new CategoryResponse(c)),
      result.meta,
    );
  }

  @RequirePermissions(PERMISSIONS.CATEGORIES_READ)
  @Get(':id')
  @HttpCode(HttpStatus.OK)
  async get(@Param('id') id: string): Promise<CategoryResponse> {
    const category = await this.getCategoryUseCase.execute(id);
    return new CategoryResponse(category);
  }

  @RequirePermissions(PERMISSIONS.CATEGORIES_CREATE)
  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() request: CreateCategoryRequest): Promise<CategoryResponse> {
    const category = await this.createCategoryUseCase.execute(request);
    return new CategoryResponse(category);
  }

  @RequirePermissions(PERMISSIONS.CATEGORIES_UPDATE)
  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  async update(
    @Param('id') id: string,
    @Body() request: UpdateCategoryRequest,
  ): Promise<CategoryResponse> {
    const category = await this.updateCategoryUseCase.execute(id, request);
    return new CategoryResponse(category);
  }

  @RequirePermissions(PERMISSIONS.CATEGORIES_DELETE)
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async delete(@Param('id') id: string): Promise<void> {
    await this.deleteCategoryUseCase.execute(id);
  }
}
