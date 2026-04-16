import {
  BadRequestException,
  ForbiddenException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import type { Cache } from 'cache-manager';
import { Listing } from '../entities/listing.entity';
import { AuditService } from '../../audit/audit.service';
import { AUDIT_ACTION } from '../../audit/constants/audit-action.constants';
import { hasPermission, PERMISSIONS } from '../../../shared/security';
import type { IUser } from '../../../shared';
import type { BoostListingRequestDto } from '../dto/request/boost-listing.dto';

@Injectable()
export class BoostListingUseCase {
  constructor(
    @InjectRepository(Listing)
    private readonly listingRepository: Repository<Listing>,
    private readonly auditService: AuditService,
    @Inject(CACHE_MANAGER) private readonly cacheManager: Cache,
  ) {}

  async execute(listingId: string, dto: BoostListingRequestDto, actor: IUser): Promise<Listing> {
    const listing = await this.listingRepository.findOne({ where: { id: listingId } });
    if (!listing) {
      throw new NotFoundException('Listing not found');
    }
    if (!hasPermission(actor, PERMISSIONS.LISTINGS_MANAGE_ANY) && listing.userId !== actor.id) {
      throw new ForbiddenException('You do not have permission to boost this listing');
    }
    const expiresAt = new Date(dto.expiresAt);
    if (expiresAt <= new Date()) {
      throw new BadRequestException('expiresAt must be a future date');
    }
    listing.isBoosted = true;
    listing.boostedUntil = expiresAt;
    const saved = await this.listingRepository.save(listing);
    await this.cacheManager.clear();
    await this.auditService.log({
      actorId: actor.id,
      action: AUDIT_ACTION.LISTING_BOOSTED,
      entity: 'listing',
      entityId: listingId,
      after: { boostedUntil: expiresAt },
    });
    return saved;
  }
}
