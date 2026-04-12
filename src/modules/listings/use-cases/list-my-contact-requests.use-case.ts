import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ContactRequest } from '../entities/contact-request.entity';
import type { IUser } from '../../../shared';
import {
  paginate,
  SortOrder,
  type PaginationQuery,
  type PaginationResult,
} from '../../../shared/pagination';

@Injectable()
export class ListMyContactRequestsUseCase {
  constructor(
    @InjectRepository(ContactRequest)
    private readonly contactRequestRepository: Repository<ContactRequest>,
  ) {}

  async execute(user: IUser, query: PaginationQuery): Promise<PaginationResult<ContactRequest>> {
    const qb = this.contactRequestRepository
      .createQueryBuilder('cr')
      .leftJoinAndSelect('cr.listing', 'l')
      .where('cr.userId = :userId', { userId: user.id });

    return paginate<ContactRequest>(qb, query, {
      defaultSort: [{ field: 'createdAt', order: SortOrder.DESC }],
      maxFilterDepth: 2,
    });
  }
}
