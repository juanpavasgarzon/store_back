import { Injectable, ForbiddenException } from '@nestjs/common';
import { FindContactConfigUseCase } from './find-contact-config.use-case';
import type { IUser } from '../../../shared';
import { ROLES } from '../../../shared/constants';

@Injectable()
export class GetContactConfigUseCase {
  constructor(private readonly findContactConfigUseCase: FindContactConfigUseCase) {}

  async execute(user: IUser) {
    if (user.role !== ROLES.OWNER) {
      throw new ForbiddenException();
    }
    return this.findContactConfigUseCase.execute();
  }
}
