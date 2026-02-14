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
import { ListingsModule } from '../listings/listings.module';

@Module({
  imports: [TypeOrmModule.forFeature([User]), ListingsModule],
  controllers: [UsersController, MeController],
  providers: [
    UserService,
    FindUserByEmailUseCase,
    FindUserByIdUseCase,
    CreateUserUseCase,
    GetProfileUseCase,
    ListUsersUseCase,
  ],
  exports: [UserService],
})
export class UsersModule {}
