import { IsIn } from 'class-validator';
import { ROLES } from '../../../../shared/security/constants/roles.constants';
import type { Role } from '../../../../shared/security/interfaces/role.interface';

export class SetUserRoleDto {
  @IsIn(Object.values(ROLES))
  role: Role;
}
