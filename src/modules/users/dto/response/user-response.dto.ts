import type { User } from '../../entities/user.entity';

export class UserResponse {
  id: string;
  email: string;
  name: string;
  role: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;

  constructor(user: User) {
    this.id = user.id;
    this.email = user.email;
    this.name = user.name;
    this.role = user.role;
    this.isActive = user.isActive ?? true;
    this.createdAt = user.createdAt;
    this.updatedAt = user.updatedAt;
  }
}
