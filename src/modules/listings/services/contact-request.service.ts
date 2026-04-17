import { Injectable } from '@nestjs/common';
import { ListMyContactRequestsUseCase } from '../use-cases/list-my-contact-requests.use-case';
import { ListReceivedContactRequestsUseCase } from '../use-cases/list-received-contact-requests.use-case';
import type { ContactRequest } from '../entities/contact-request.entity';
import type { IUser } from '../../../shared';
import type { PaginationQuery, PaginationResult } from '../../../shared/pagination';

@Injectable()
export class ContactRequestService {
  constructor(
    private readonly listMyContactRequestsUseCase: ListMyContactRequestsUseCase,
    private readonly listReceivedContactRequestsUseCase: ListReceivedContactRequestsUseCase,
  ) {}

  listMyContactRequests(
    user: IUser,
    query: PaginationQuery,
  ): Promise<PaginationResult<ContactRequest>> {
    return this.listMyContactRequestsUseCase.execute(user, query);
  }

  listReceivedContactRequests(
    user: IUser,
    query: PaginationQuery,
  ): Promise<PaginationResult<ContactRequest>> {
    return this.listReceivedContactRequestsUseCase.execute(user, query);
  }
}
