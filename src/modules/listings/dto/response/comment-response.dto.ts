import type { Comment } from '../../entities/comment.entity';

export class CommentResponseDto {
  id: string;
  userId: string;
  listingId: string;
  content: string;
  createdAt: Date;
  userName?: string;

  constructor(comment: Comment) {
    this.id = comment.id;
    this.userId = comment.userId;
    this.listingId = comment.listingId;
    this.content = comment.content;
    this.createdAt = comment.createdAt;
    this.userName = comment.user?.name;
  }
}
