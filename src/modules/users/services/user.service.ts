import { Injectable } from '@nestjs/common';
import { Role } from 'src/shared';
import type { User } from '../entities/user.entity';
import { CreateUserUseCase } from '../use-cases/create-user.use-case';
import { FindUserByEmailUseCase } from '../use-cases/find-user-by-email.use-case';
import { FindUserByIdUseCase } from '../use-cases/find-user-by-id.use-case';
import { CheckOwnerExistsUseCase } from '../use-cases/check-owner-exists.use-case';

@Injectable()
export class UserService {
  constructor(
    private readonly findUserByEmailUseCase: FindUserByEmailUseCase,
    private readonly findUserByIdUseCase: FindUserByIdUseCase,
    private readonly createUserUseCase: CreateUserUseCase,
    private readonly checkOwnerExistsUseCase: CheckOwnerExistsUseCase,
  ) {}

  findByEmail(email: string): Promise<User | null> {
    return this.findUserByEmailUseCase.execute(email);
  }

  findById(id: string): Promise<User | null> {
    return this.findUserByIdUseCase.execute(id);
  }

  create(data: { email: string; passwordHash: string; name: string; role?: Role }): Promise<User> {
    return this.createUserUseCase.execute(data);
  }

  ownerExists(): Promise<boolean> {
    return this.checkOwnerExistsUseCase.execute();
  }
}
