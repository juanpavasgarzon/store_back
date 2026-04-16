import {
  Controller,
  Get,
  Patch,
  Delete,
  Body,
  Param,
  Query,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { CurrentUser, RequirePermissions } from '../../../shared';
import { PERMISSIONS } from '../../../shared/security';
import type { IUser } from '../../../shared';
import { ListUsersUseCase } from '../use-cases/list-users.use-case';
import { SetUserActiveUseCase } from '../use-cases/set-user-active.use-case';
import { SetUserRoleUseCase } from '../use-cases/set-user-role.use-case';
import { DeleteUserUseCase } from '../use-cases/delete-user.use-case';
import { SetUserActiveDto } from '../dto/request/set-user-active.dto';
import { SetUserRoleDto } from '../dto/request/set-user-role.dto';
import { UserResponseDto } from '../dto/response/user-response.dto';
import {
  PaginationResponse,
  ParsePaginationQueryPipe,
  PaginationRequest,
} from '../../../shared/pagination';

@Controller('users')
export class UsersController {
  constructor(
    private readonly listUsersUseCase: ListUsersUseCase,
    private readonly setUserActiveUseCase: SetUserActiveUseCase,
    private readonly setUserRoleUseCase: SetUserRoleUseCase,
    private readonly deleteUserUseCase: DeleteUserUseCase,
  ) {}

  @RequirePermissions(PERMISSIONS.USERS_READ)
  @Get()
  @HttpCode(HttpStatus.OK)
  async list(
    @Query(ParsePaginationQueryPipe) query: PaginationRequest,
  ): Promise<PaginationResponse<UserResponseDto>> {
    const result = await this.listUsersUseCase.execute(query);
    return new PaginationResponse(
      result.data.map((user) => new UserResponseDto(user)),
      result.meta,
    );
  }

  @RequirePermissions(PERMISSIONS.USERS_ACTIVATE)
  @Patch(':id/active')
  @HttpCode(HttpStatus.OK)
  async setActive(
    @CurrentUser() actor: IUser,
    @Param('id') id: string,
    @Body() dto: SetUserActiveDto,
  ): Promise<UserResponseDto> {
    const user = await this.setUserActiveUseCase.execute(id, dto.isActive, actor.id);
    return new UserResponseDto(user);
  }

  @RequirePermissions(PERMISSIONS.USERS_ROLE_UPDATE)
  @Patch(':id/role')
  @HttpCode(HttpStatus.OK)
  async setRole(
    @CurrentUser() actor: IUser,
    @Param('id') id: string,
    @Body() dto: SetUserRoleDto,
  ): Promise<UserResponseDto> {
    const user = await this.setUserRoleUseCase.execute(id, dto.role, actor);
    return new UserResponseDto(user);
  }

  @RequirePermissions(PERMISSIONS.USERS_DELETE)
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async delete(@CurrentUser() actor: IUser, @Param('id') id: string): Promise<void> {
    await this.deleteUserUseCase.execute(id, actor.id);
  }
}
