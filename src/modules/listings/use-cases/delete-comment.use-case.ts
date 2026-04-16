import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Comment } from '../entities/comment.entity';
import { hasPermission, PERMISSIONS } from '../../../shared/security';
import type { IUser } from '../../../shared/security/interfaces/user.interface';

@Injectable()
export class DeleteCommentUseCase {
  constructor(
    @InjectRepository(Comment)
    private readonly commentRepository: Repository<Comment>,
  ) {}

  async execute(commentId: string, actor: IUser): Promise<void> {
    const comment = await this.commentRepository.findOne({ where: { id: commentId } });
    if (!comment) {
      throw new NotFoundException('Comment not found');
    }

    if (!hasPermission(actor, PERMISSIONS.COMMENTS_MANAGE_ANY) && comment.userId !== actor.id) {
      throw new ForbiddenException('You can only delete your own comments');
    }

    await this.commentRepository.remove(comment);
  }
}
