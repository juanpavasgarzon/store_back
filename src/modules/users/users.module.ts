import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { UserService } from './services/user.service';
import { UsersController } from './controllers/users.controller';
import { MeController } from './controllers/me.controller';
import { FindUserByEmailUseCase } from './use-cases/find-user-by-email.use-case';
import { FindUserByIdUseCase } from './use-cases/find-user-by-id.use-case';
import { CreateUserUseCase } from './use-cases/create-user.use-case';
import { GetProfileUseCase } from './use-cases/get-profile.use-case';
import { ListUsersUseCase } from './use-cases/list-users.use-case';
import { UpdateProfileUseCase } from './use-cases/update-profile.use-case';
import { ChangePasswordUseCase } from './use-cases/change-password.use-case';
import { SetUserActiveUseCase } from './use-cases/set-user-active.use-case';
import { SetUserRoleUseCase } from './use-cases/set-user-role.use-case';
import { DeleteUserUseCase } from './use-cases/delete-user.use-case';
import { ListingsModule } from '../listings/listings.module';
import { AuditModule } from '../audit/audit.module';

@Module({
  imports: [TypeOrmModule.forFeature([User]), ListingsModule, AuditModule],
  controllers: [UsersController, MeController],
  providers: [
    UserService,
    FindUserByEmailUseCase,
    FindUserByIdUseCase,
    CreateUserUseCase,
    GetProfileUseCase,
    ListUsersUseCase,
    UpdateProfileUseCase,
    ChangePasswordUseCase,
    SetUserActiveUseCase,
    SetUserRoleUseCase,
    DeleteUserUseCase,
  ],
  exports: [UserService],
})
export class UsersModule {}
