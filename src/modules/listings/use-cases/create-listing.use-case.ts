import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import sanitizeHtml from 'sanitize-html';
import { Listing } from '../entities/listing.entity';
import { ListingAttributeValue } from '../entities/listing-attribute-value.entity';
import { CategoryService } from '../../categories/services/category.service';
import { ListingCodeService } from '../services/listing-code.service';
import { LISTING_STATUS } from '../constants/listing-status.constants';
import type { IUser } from '../../../shared';
import type { CreateListingRequestDto } from '../dto/request/create-listing.dto';

@Injectable()
export class CreateListingUseCase {
  constructor(
    @InjectRepository(Listing)
    private readonly listingRepository: Repository<Listing>,
    @InjectRepository(ListingAttributeValue)
    private readonly listingAttributeValueRepository: Repository<ListingAttributeValue>,
    private readonly categoryService: CategoryService,
    private readonly listingCodeService: ListingCodeService,
  ) {}

  async execute(user: IUser, dto: CreateListingRequestDto): Promise<Listing> {
    const category = await this.categoryService.findById(dto.categoryId);
    if (!category) {
      throw new NotFoundException('Category not found');
    }

    const code = await this.listingCodeService.generateUniqueCode();

    const listingEntity = this.listingRepository.create({
      code,
      userId: user.id,
      categoryId: dto.categoryId,
      title: sanitizeHtml(dto.title, { allowedTags: [] }),
      description: sanitizeHtml(dto.description, { allowedTags: [] }),
      price: String(dto.price),
      location: dto.location,
      sector: dto.sector ?? null,
      latitude: dto.latitude != null ? String(dto.latitude) : null,
      longitude: dto.longitude != null ? String(dto.longitude) : null,
      status: dto.status ?? LISTING_STATUS.ACTIVE,
      expiresAt: dto.expiresAt != null ? new Date(dto.expiresAt) : null,
    });

    const savedListing = await this.listingRepository.save(listingEntity);

    if (dto.attributeValues && dto.attributeValues.length > 0) {
      const categoryAttributes = await this.categoryService.findAttributesByCategoryId(
        dto.categoryId,
      );
      const validAttributeIds = new Set(categoryAttributes.map((attribute) => attribute.id));

      const attributeValueEntities = dto.attributeValues
        .filter((input) => validAttributeIds.has(input.attributeId))
        .map((input) =>
          this.listingAttributeValueRepository.create({
            listingId: savedListing.id,
            attributeId: input.attributeId,
            value: input.value,
          }),
        );

      if (attributeValueEntities.length > 0) {
        await this.listingAttributeValueRepository.save(attributeValueEntities);
      }
    }

    const createdListing = await this.listingRepository.findOne({
      where: { id: savedListing.id },
      relations: ['category', 'photos', 'attributeValues', 'attributeValues.attribute'],
    });

    if (!createdListing) {
      throw new NotFoundException('Listing not found after create');
    }

    return createdListing;
  }
}
