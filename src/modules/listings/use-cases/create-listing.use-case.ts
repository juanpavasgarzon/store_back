import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { Listing } from '../entities/listing.entity';
import { ListingVariantValue } from '../entities/listing-variant-value.entity';
import { CategoryService } from '../../categories/services/category.service';
import { FindCategoryVariantByIdUseCase } from '../../categories/use-cases/find-category-variant-by-id.use-case';
import { ListingCodeService } from '../services/listing-code.service';
import { LISTING_STATUS } from '../constants/listing-status.constants';
import type { IUser } from '../../../shared';
import type { CreateListingRequestDto } from '../dto/request/create-listing.dto';

@Injectable()
export class CreateListingUseCase {
  constructor(
    @InjectRepository(Listing)
    private readonly listingRepository: Repository<Listing>,
    @InjectRepository(ListingVariantValue)
    private readonly listingVariantValueRepository: Repository<ListingVariantValue>,
    private readonly categoryService: CategoryService,
    private readonly findCategoryVariantByIdUseCase: FindCategoryVariantByIdUseCase,
    private readonly listingCodeService: ListingCodeService,
    private readonly dataSource: DataSource,
  ) {}

  async execute(user: IUser, dto: CreateListingRequestDto): Promise<Listing> {
    const category = await this.categoryService.findById(dto.categoryId);
    if (!category) {
      throw new NotFoundException('Category not found');
    }

    const categoryVariantIds = dto.variants?.map((v) => v.categoryVariantId) ?? [];
    for (const categoryVariantId of categoryVariantIds) {
      const variant = await this.findCategoryVariantByIdUseCase.execute(categoryVariantId);
      if (!variant) {
        throw new NotFoundException(`Category variant not found: ${categoryVariantId}`);
      }
    }

    const code = await this.listingCodeService.generateUniqueCode();

    const listingId = await this.dataSource.transaction(async (manager) => {
      const listingEntity = manager.create(Listing, {
        code,
        userId: user.id,
        categoryId: dto.categoryId,
        title: dto.title,
        description: dto.description,
        price: String(dto.price),
        location: dto.location,
        sector: dto.sector ?? null,
        latitude: dto.latitude != null ? String(dto.latitude) : null,
        longitude: dto.longitude != null ? String(dto.longitude) : null,
        status: dto.status ?? LISTING_STATUS.ACTIVE,
        expiresAt: dto.expiresAt != null ? new Date(dto.expiresAt) : null,
      });
      const saved = await manager.save(listingEntity);

      const variantEntities = (dto.variants ?? []).map((variant) =>
        manager.create(ListingVariantValue, {
          listingId: saved.id,
          categoryVariantId: variant.categoryVariantId,
          value: variant.value,
        }),
      );
      if (variantEntities.length > 0) {
        await manager.save(variantEntities);
      }

      return saved.id;
    });

    const created = await this.listingRepository.findOne({
      where: { id: listingId },
      relations: ['category', 'photos', 'variants', 'variants.categoryVariant'],
    });
    if (!created) {
      throw new NotFoundException('Listing not found after create');
    }
    return created;
  }
}
