import { ROLE_PERMISSIONS } from '../constants/role-permissions';
import type { Permission } from '../interfaces/permission.interface';
import type { IUser } from '../interfaces/user.interface';

export function hasPermission(user: IUser, permission: Permission): boolean {
  const permissions = ROLE_PERMISSIONS[user.role] ?? [];
  return permissions.includes(permission);
}
