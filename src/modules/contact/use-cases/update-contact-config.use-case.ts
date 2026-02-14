import { Injectable, ForbiddenException } from '@nestjs/common';
import { SaveContactConfigUseCase } from './save-contact-config.use-case';
import type { IUser } from '../../../shared';
import type { UpdateContactConfigRequestDto } from '../dto/request/contact-config.dto';
import { ROLES } from '../../../shared/constants';

function hasPermission(user: IUser): boolean {
  return user.role === ROLES.OWNER;
}

@Injectable()
export class UpdateContactConfigUseCase {
  constructor(private readonly saveContactConfigUseCase: SaveContactConfigUseCase) {}

  async execute(user: IUser, dto: UpdateContactConfigRequestDto) {
    if (!hasPermission(user)) {
      throw new ForbiddenException();
    }
    return this.saveContactConfigUseCase.execute({
      recipientEmail: dto.recipientEmail,
      subjectTemplate: dto.subjectTemplate,
      messageTemplate: dto.messageTemplate,
    });
  }
}
