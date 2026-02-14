import { Controller, Get, Query, HttpCode, HttpStatus } from '@nestjs/common';
import { RequirePermissions } from '../../../shared';
import { PERMISSIONS } from '../../../shared/security';
import { ListUsersUseCase } from '../use-cases/list-users.use-case';
import { UserResponseDto } from '../dto/response/user-response.dto';
import {
  PaginationResponse,
  ParsePaginationQueryPipe,
  PaginationRequest,
} from '../../../shared/pagination';

@Controller('users')
export class UsersController {
  constructor(private readonly listUsersUseCase: ListUsersUseCase) {}

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
}
