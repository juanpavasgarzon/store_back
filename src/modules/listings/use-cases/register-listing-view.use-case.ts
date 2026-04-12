import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ListingView } from '../entities/listing-view.entity';

@Injectable()
export class RegisterListingViewUseCase {
  constructor(
    @InjectRepository(ListingView)
    private readonly listingViewRepository: Repository<ListingView>,
  ) {}

  async execute(listingId: string, userId: string | null, ipAddress: string | null): Promise<void> {
    const view = this.listingViewRepository.create({
      listingId,
      userId,
      ipAddress,
    });
    await this.listingViewRepository.save(view);
  }
}
