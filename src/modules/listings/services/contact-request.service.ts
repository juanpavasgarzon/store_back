import { Injectable } from '@nestjs/common';
import { ListMyContactRequestsUseCase } from '../use-cases/list-my-contact-requests.use-case';
import type { ContactRequest } from '../entities/contact-request.entity';
import type { IUser } from '../../../shared';
import type { PaginationQuery, PaginationResult } from '../../../shared/pagination';

@Injectable()
export class ContactRequestService {
  constructor(private readonly listMyContactRequestsUseCase: ListMyContactRequestsUseCase) {}

  listMyContactRequests(
    user: IUser,
    query: PaginationQuery,
  ): Promise<PaginationResult<ContactRequest>> {
    return this.listMyContactRequestsUseCase.execute(user, query);
  }
}
