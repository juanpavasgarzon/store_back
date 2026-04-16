import { ROLE_PERMISSIONS } from '../../../../shared/security/constants/role-permissions';
import type { Role } from '../../../../shared/security/interfaces/role.interface';

export class MeProfileResponseDto {
  id: string;
  email: string;
  name: string;
  role: string;
  permissions: string[];

  constructor(data: { id: string; email: string; name: string; role: string; permissions?: string[] }) {
    this.id = data.id;
    this.email = data.email;
    this.name = data.name;
    this.role = data.role;
    this.permissions = data.permissions ?? ROLE_PERMISSIONS[data.role as Role] ?? [];
  }
}
