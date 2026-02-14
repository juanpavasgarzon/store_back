import { Controller, Get, Post, Body, Param, Query, HttpCode, HttpStatus } from '@nestjs/common';
import { CurrentUser, Public, RequirePermissions } from '../../../shared';
import { PERMISSIONS } from '../../../shared/constants';
import type { IUser } from '../../../shared';
import { CreateCommentUseCase } from '../use-cases/create-comment.use-case';
import { ListCommentsUseCase } from '../use-cases/list-comments.use-case';
import { CreateCommentRequestDto } from '../dto/request/create-comment.dto';
import { CommentResponseDto } from '../dto/response/comment-response.dto';
import {
  PaginationResponse,
  ParsePaginationQueryPipe,
  PaginationRequest,
} from '../../../shared/pagination';

@Controller('listings/:listingId/comments')
export class CommentController {
  constructor(
    private readonly createCommentUseCase: CreateCommentUseCase,
    private readonly listCommentsUseCase: ListCommentsUseCase,
  ) {}

  @Public()
  @Get()
  @HttpCode(HttpStatus.OK)
  async list(
    @Param('listingId') listingId: string,
    @Query(ParsePaginationQueryPipe) query: PaginationRequest,
  ): Promise<PaginationResponse<CommentResponseDto>> {
    const result = await this.listCommentsUseCase.execute(listingId, query);
    return new PaginationResponse(
      result.data.map((c) => new CommentResponseDto(c)),
      result.meta,
    );
  }

  @RequirePermissions(PERMISSIONS.COMMENTS_CREATE)
  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(
    @Param('listingId') listingId: string,
    @CurrentUser() user: IUser,
    @Body() request: CreateCommentRequestDto,
  ): Promise<CommentResponseDto> {
    const comment = await this.createCommentUseCase.execute(listingId, user, request);
    return new CommentResponseDto(comment);
  }
}
