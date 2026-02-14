import type { Role } from './role.interface';

export interface IUser {
  id: string;
  email: string;
  name: string;
  role: Role;
}
