import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import type { Cache } from 'cache-manager';
import { Listing } from '../entities/listing.entity';
import { AuditService } from '../../audit/audit.service';
import { AUDIT_ACTION } from '../../audit/constants/audit-action.constants';
import { ROLES } from '../../../shared/security';
import type { IUser } from '../../../shared';

@Injectable()
export class DeleteListingUseCase {
  constructor(
    @InjectRepository(Listing)
    private readonly listingRepository: Repository<Listing>,
    private readonly auditService: AuditService,
    @Inject(CACHE_MANAGER) private readonly cacheManager: Cache,
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
    await this.cacheManager.clear();
    await this.auditService.log({
      actorId: user.id,
      action: AUDIT_ACTION.LISTING_DELETED,
      entity: 'listing',
      entityId: id,
      before: { title: listing.title, status: listing.status },
    });
  }
}
