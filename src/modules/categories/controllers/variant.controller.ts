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
import { RequirePermissions } from '../../../shared';
import { PERMISSIONS } from '../../../shared/security';
import { CreateCategoryVariantUseCase } from '../use-cases/create-category-variant.use-case';
import { UpdateCategoryVariantUseCase } from '../use-cases/update-category-variant.use-case';
import { DeleteCategoryVariantUseCase } from '../use-cases/delete-category-variant.use-case';
import { ListVariantsByCategoryUseCase } from '../use-cases/list-variants-by-category.use-case';
import { CreateCategoryVariantRequestDto } from '../dto/request/create-variant.dto';
import { UpdateCategoryVariantRequestDto } from '../dto/request/update-variant.dto';
import { VariantResponseDto } from '../dto/response/variant-response.dto';

@Controller('categories/:categoryId/variants')
export class VariantController {
  constructor(
    private readonly createCategoryVariantUseCase: CreateCategoryVariantUseCase,
    private readonly updateCategoryVariantUseCase: UpdateCategoryVariantUseCase,
    private readonly deleteCategoryVariantUseCase: DeleteCategoryVariantUseCase,
    private readonly listVariantsByCategoryUseCase: ListVariantsByCategoryUseCase,
  ) {}

  @RequirePermissions(PERMISSIONS.VARIANTS_READ)
  @Get()
  @HttpCode(HttpStatus.OK)
  async list(@Param('categoryId') categoryId: string): Promise<VariantResponseDto[]> {
    const list = await this.listVariantsByCategoryUseCase.execute(categoryId);
    return list.map((v) => new VariantResponseDto(v));
  }

  @RequirePermissions(PERMISSIONS.VARIANTS_CREATE)
  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(
    @Param('categoryId') categoryId: string,
    @Body() dto: CreateCategoryVariantRequestDto,
  ): Promise<VariantResponseDto> {
    const variant = await this.createCategoryVariantUseCase.execute(categoryId, dto);
    return new VariantResponseDto(variant);
  }

  @RequirePermissions(PERMISSIONS.VARIANTS_UPDATE)
  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  async update(
    @Param('id') id: string,
    @Body() dto: UpdateCategoryVariantRequestDto,
  ): Promise<VariantResponseDto> {
    const variant = await this.updateCategoryVariantUseCase.execute(id, dto);
    return new VariantResponseDto(variant);
  }

  @RequirePermissions(PERMISSIONS.VARIANTS_DELETE)
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async delete(@Param('id') id: string): Promise<void> {
    await this.deleteCategoryVariantUseCase.execute(id);
  }
}
