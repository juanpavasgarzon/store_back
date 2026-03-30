import { IsIn } from 'class-validator';
import { CONTACT_REQUEST_STATUS } from '../../constants/contact-request-status.constants';
import type { ContactRequestStatus } from '../../constants/contact-request-status.constants';

export class UpdateContactRequestStatusDto {
  @IsIn(Object.values(CONTACT_REQUEST_STATUS))
  status: ContactRequestStatus;
}
