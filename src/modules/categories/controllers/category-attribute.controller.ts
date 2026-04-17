import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { Public, RequirePermissions } from '../../../shared';
import { PERMISSIONS } from '../../../shared/security';
import { ListCategoryAttributesUseCase } from '../use-cases/list-category-attributes.use-case';
import { CreateCategoryAttributeUseCase } from '../use-cases/create-category-attribute.use-case';
import { UpdateCategoryAttributeUseCase } from '../use-cases/update-category-attribute.use-case';
import { DeleteCategoryAttributeUseCase } from '../use-cases/delete-category-attribute.use-case';
import { CreateCategoryAttributeRequest } from '../dto/request/create-category-attribute.dto';
import { UpdateCategoryAttributeRequest } from '../dto/request/update-category-attribute.dto';
import { CategoryAttributeResponse } from '../dto/response/category-attribute-response.dto';

@Controller('categories/:categoryId/attributes')
export class CategoryAttributeController {
  constructor(
    private readonly listCategoryAttributesUseCase: ListCategoryAttributesUseCase,
    private readonly createCategoryAttributeUseCase: CreateCategoryAttributeUseCase,
    private readonly updateCategoryAttributeUseCase: UpdateCategoryAttributeUseCase,
    private readonly deleteCategoryAttributeUseCase: DeleteCategoryAttributeUseCase,
  ) {}

  @Public()
  @Get()
  @HttpCode(HttpStatus.OK)
  async list(@Param('categoryId') categoryId: string): Promise<CategoryAttributeResponse[]> {
    const attributes = await this.listCategoryAttributesUseCase.execute(categoryId);
    return attributes.map((attribute) => new CategoryAttributeResponse(attribute));
  }

  @RequirePermissions(PERMISSIONS.CATEGORIES_CREATE)
  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(
    @Param('categoryId') categoryId: string,
    @Body() request: CreateCategoryAttributeRequest,
  ): Promise<CategoryAttributeResponse> {
    const attribute = await this.createCategoryAttributeUseCase.execute(categoryId, request);
    return new CategoryAttributeResponse(attribute);
  }

  @RequirePermissions(PERMISSIONS.CATEGORIES_UPDATE)
  @Patch(':attributeId')
  @HttpCode(HttpStatus.OK)
  async update(
    @Param('categoryId') categoryId: string,
    @Param('attributeId') attributeId: string,
    @Body() request: UpdateCategoryAttributeRequest,
  ): Promise<CategoryAttributeResponse> {
    const attribute = await this.updateCategoryAttributeUseCase.execute(categoryId, attributeId, request);
    return new CategoryAttributeResponse(attribute);
  }

  @RequirePermissions(PERMISSIONS.CATEGORIES_DELETE)
  @Delete(':attributeId')
  @HttpCode(HttpStatus.NO_CONTENT)
  async delete(
    @Param('categoryId') categoryId: string,
    @Param('attributeId') attributeId: string,
  ): Promise<void> {
    await this.deleteCategoryAttributeUseCase.execute(categoryId, attributeId);
  }
}
