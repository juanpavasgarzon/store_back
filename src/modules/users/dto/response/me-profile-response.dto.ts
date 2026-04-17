import { ROLE_PERMISSIONS } from '../../../../shared/security/constants/role-permissions';
import type { Role } from '../../../../shared/security/interfaces/role.interface';

export class MeProfileResponseDto {
  id: string;
  email: string;
  name: string;
  role: string;
  permissions: string[];
  phone: string | null;
  whatsapp: string | null;
  city: string | null;

  constructor(data: {
    id: string;
    email: string;
    name: string;
    role: string;
    permissions?: string[];
    phone?: string | null;
    whatsapp?: string | null;
    city?: string | null;
  }) {
    this.id = data.id;
    this.email = data.email;
    this.name = data.name;
    this.role = data.role;
    this.permissions = data.permissions ?? ROLE_PERMISSIONS[data.role as Role] ?? [];
    this.phone = data.phone ?? null;
    this.whatsapp = data.whatsapp ?? null;
    this.city = data.city ?? null;
  }
}
