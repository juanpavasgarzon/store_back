import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Listing } from '../entities/listing.entity';
import { ROLES } from '../../../shared/security';
import type { IUser } from '../../../shared';

@Injectable()
export class DeleteListingUseCase {
  constructor(
    @InjectRepository(Listing)
    private readonly listingRepository: Repository<Listing>,
  ) {}

  async execute(id: string, user: IUser): Promise<void> {
    const listing = await this.listingRepository.findOne({ where: { id } });
    if (!listing) {
      throw new NotFoundException('Listing not found');
    }
    const isPrivileged = user.role === ROLES.ADMIN || user.role === ROLES.OWNER;
    if (!isPrivileged && listing.userId !== user.id) {
      throw new NotFoundException('Listing not found');
    }
    await this.listingRepository.softDelete(id);
  }
}
