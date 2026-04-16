import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import type { Cache } from 'cache-manager';
import sanitizeHtml from 'sanitize-html';
import { Listing } from '../entities/listing.entity';
import { ListingVariantValue } from '../entities/listing-variant-value.entity';
import { ListingPriceHistory } from '../entities/listing-price-history.entity';
import { CategoryService } from '../../categories/services/category.service';
import { hasPermission, PERMISSIONS } from '../../../shared/security';
import type { IUser } from '../../../shared';
import type { UpdateListingRequestDto } from '../dto/request/update-listing.dto';

@Injectable()
export class UpdateListingUseCase {
  constructor(
    @InjectRepository(Listing)
    private readonly listingRepository: Repository<Listing>,
    private readonly categoryService: CategoryService,
    private readonly dataSource: DataSource,
    @Inject(CACHE_MANAGER) private readonly cacheManager: Cache,
  ) {}

  async execute(id: string, user: IUser, dto: UpdateListingRequestDto): Promise<Listing> {
    const listing = await this.listingRepository.findOne({ where: { id } });
    if (!listing) {
      throw new NotFoundException('Listing not found');
    }
    if (!hasPermission(user, PERMISSIONS.LISTINGS_MANAGE_ANY) && listing.userId !== user.id) {
      throw new NotFoundException('Listing not found');
    }
    if (dto.categoryId != null) {
      const category = await this.categoryService.findById(dto.categoryId);
      if (!category) {
        throw new NotFoundException('Category not found');
      }
    }

    const priceChanged = dto.price != null && String(dto.price) !== listing.price;
    const previousPrice = listing.price;

    await this.dataSource.transaction(async (manager) => {
      if (dto.categoryId != null) {
        listing.categoryId = dto.categoryId;
      }
      if (dto.title != null) {
        listing.title = sanitizeHtml(dto.title, { allowedTags: [] });
      }
      if (dto.description != null) {
        listing.description = sanitizeHtml(dto.description, { allowedTags: [] });
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

      if (priceChanged) {
        const priceHistory = manager.create(ListingPriceHistory, {
          listingId: listing.id,
          price: previousPrice,
          changedByUserId: user.id,
        });
        await manager.save(priceHistory);
      }

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
    await this.cacheManager.clear();
    return updated;
  }
}
