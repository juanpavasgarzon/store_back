import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { Listing } from '../entities/listing.entity';
import { ListingVariantValue } from '../entities/listing-variant-value.entity';
import { CategoryService } from '../../categories/services/category.service';
import { ROLES } from '../../../shared/security';
import type { IUser } from '../../../shared';
import type { UpdateListingRequestDto } from '../dto/request/update-listing.dto';

@Injectable()
export class UpdateListingUseCase {
  constructor(
    @InjectRepository(Listing)
    private readonly listingRepository: Repository<Listing>,
    @InjectRepository(ListingVariantValue)
    private readonly listingVariantValueRepository: Repository<ListingVariantValue>,
    private readonly categoryService: CategoryService,
    private readonly dataSource: DataSource,
  ) {}

  async execute(id: string, user: IUser, dto: UpdateListingRequestDto): Promise<Listing> {
    const listing = await this.listingRepository.findOne({ where: { id } });
    if (!listing) {
      throw new NotFoundException('Listing not found');
    }
    const isPrivileged = user.role === ROLES.ADMIN || user.role === ROLES.OWNER;
    if (!isPrivileged && listing.userId !== user.id) {
      throw new NotFoundException('Listing not found');
    }
    if (dto.categoryId != null) {
      const category = await this.categoryService.findById(dto.categoryId);
      if (!category) {
        throw new NotFoundException('Category not found');
      }
    }

    await this.dataSource.transaction(async (manager) => {
      if (dto.categoryId != null) {
        listing.categoryId = dto.categoryId;
      }
      if (dto.title != null) {
        listing.title = dto.title;
      }
      if (dto.description != null) {
        listing.description = dto.description;
      }
      if (dto.price != null) {
        listing.price = String(dto.price);
      }
      if (dto.location != null) {
        listing.location = dto.location;
      }
      if (dto.sector !== undefined) {
        listing.sector = dto.sector ?? null;
      }
      if (dto.latitude !== undefined) {
        listing.latitude = dto.latitude != null ? String(dto.latitude) : null;
      }
      if (dto.longitude !== undefined) {
        listing.longitude = dto.longitude != null ? String(dto.longitude) : null;
      }
      if (dto.status != null) {
        listing.status = dto.status;
      }
      if (dto.expiresAt !== undefined) {
        listing.expiresAt = dto.expiresAt != null ? new Date(dto.expiresAt) : null;
      }
      await manager.save(listing);

      if (dto.variants != null) {
        await manager.delete(ListingVariantValue, { listingId: id });
        const variantEntities = dto.variants.map((v) =>
          manager.create(ListingVariantValue, {
            listingId: id,
            categoryVariantId: v.categoryVariantId,
            value: v.value,
          }),
        );
        if (variantEntities.length > 0) {
          await manager.save(variantEntities);
        }
      }
    });

    const updated = await this.listingRepository.findOne({
      where: { id },
      relations: ['category', 'photos', 'variants', 'variants.categoryVariant'],
    });
    if (!updated) {
      throw new NotFoundException('Listing not found');
    }
    return updated;
  }
}
