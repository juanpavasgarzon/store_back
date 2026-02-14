import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Listing } from '../entities/listing.entity';
import { ListingPhoto } from '../entities/listing-photo.entity';
import { ListingVariantValue } from '../entities/listing-variant-value.entity';
import { CategoryService } from '../../categories/services/category.service';
import type { UpdateListingRequestDto } from '../dto/request/update-listing.dto';

@Injectable()
export class UpdateListingUseCase {
  constructor(
    @InjectRepository(Listing)
    private readonly listingRepository: Repository<Listing>,
    @InjectRepository(ListingPhoto)
    private readonly listingPhotoRepository: Repository<ListingPhoto>,
    @InjectRepository(ListingVariantValue)
    private readonly listingVariantValueRepository: Repository<ListingVariantValue>,
    private readonly categoryService: CategoryService,
  ) {}

  async execute(id: string, dto: UpdateListingRequestDto): Promise<Listing> {
    const listing = await this.listingRepository.findOne({ where: { id } });
    if (!listing) {
      throw new NotFoundException('Listing not found');
    }
    if (dto.categoryId != null) {
      const category = await this.categoryService.findById(dto.categoryId);
      if (!category) {
        throw new NotFoundException('Category not found');
      }
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
    await this.listingRepository.save(listing);
    if (dto.photos != null) {
      const existingPhotos = await this.listingPhotoRepository.find({
        where: { listingId: id },
      });
      for (const photo of existingPhotos) {
        await this.listingPhotoRepository.delete(photo.id);
      }
      for (const photoDto of dto.photos) {
        const photo = this.listingPhotoRepository.create({
          listingId: id,
          url: photoDto.url,
        });
        await this.listingPhotoRepository.save(photo);
      }
    }
    if (dto.variants != null) {
      const existingVariantValues = await this.listingVariantValueRepository.find({
        where: { listingId: id },
      });
      for (const variantValue of existingVariantValues) {
        await this.listingVariantValueRepository.delete(variantValue.id);
      }
      for (const variantValueDto of dto.variants) {
        const variantValue = this.listingVariantValueRepository.create({
          listingId: id,
          categoryVariantId: variantValueDto.categoryVariantId,
          value: variantValueDto.value,
        });
        await this.listingVariantValueRepository.save(variantValue);
      }
    }
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
