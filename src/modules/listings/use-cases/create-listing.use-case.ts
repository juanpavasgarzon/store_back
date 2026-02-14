import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Listing } from '../entities/listing.entity';
import { ListingPhoto } from '../entities/listing-photo.entity';
import { ListingVariantValue } from '../entities/listing-variant-value.entity';
import { CategoryService } from '../../categories/services/category.service';
import { FindCategoryVariantByIdUseCase } from '../../categories/use-cases/find-category-variant-by-id.use-case';
import { ListingCodeService } from '../services/listing-code.service';
import type { CreateListingRequestDto } from '../dto/request/create-listing.dto';

@Injectable()
export class CreateListingUseCase {
  constructor(
    @InjectRepository(Listing)
    private readonly listingRepository: Repository<Listing>,
    @InjectRepository(ListingPhoto)
    private readonly listingPhotoRepository: Repository<ListingPhoto>,
    @InjectRepository(ListingVariantValue)
    private readonly listingVariantValueRepository: Repository<ListingVariantValue>,
    private readonly categoryService: CategoryService,
    private readonly findCategoryVariantByIdUseCase: FindCategoryVariantByIdUseCase,
    private readonly listingCodeService: ListingCodeService,
  ) {}

  async execute(dto: CreateListingRequestDto): Promise<Listing> {
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

    const listingEntity = this.listingRepository.create({
      code,
      categoryId: dto.categoryId,
      title: dto.title,
      description: dto.description,
      price: String(dto.price),
      location: dto.location,
      sector: dto.sector ?? null,
      latitude: dto.latitude != null ? String(dto.latitude) : null,
      longitude: dto.longitude != null ? String(dto.longitude) : null,
    });
    const listing = await this.listingRepository.save(listingEntity);

    const photos: ListingPhoto[] = [];
    for (const photo of dto.photos ?? []) {
      const photoEntity = this.listingPhotoRepository.create({
        listingId: listing.id,
        url: photo.url,
      });
      photos.push(photoEntity);
    }
    if (photos.length > 0) {
      await this.listingPhotoRepository.save(photos);
    }

    const variants: ListingVariantValue[] = [];
    for (const variant of dto.variants ?? []) {
      const variantValue = this.listingVariantValueRepository.create({
        listingId: listing.id,
        categoryVariantId: variant.categoryVariantId,
        value: variant.value,
      });
      variants.push(variantValue);
    }
    if (variants.length > 0) {
      await this.listingVariantValueRepository.save(variants);
    }

    const created = await this.listingRepository.findOne({
      where: { id: listing.id },
      relations: ['category', 'photos', 'variants', 'variants.categoryVariant'],
    });
    if (!created) {
      throw new NotFoundException('Listing not found after create');
    }
    return created;
  }
}
