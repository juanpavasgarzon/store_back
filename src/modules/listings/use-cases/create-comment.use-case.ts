import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { Comment } from '../entities/comment.entity';
import { Listing } from '../entities/listing.entity';
import { LISTING_DOMAIN_EVENTS, type CommentCreatedEvent } from '../events';
import type { IUser } from '../../../shared';
import type { CreateCommentRequestDto } from '../dto/request/create-comment.dto';

@Injectable()
export class CreateCommentUseCase {
  constructor(
    @InjectRepository(Comment)
    private readonly commentRepository: Repository<Comment>,
    @InjectRepository(Listing)
    private readonly listingRepository: Repository<Listing>,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  async execute(listingId: string, user: IUser, dto: CreateCommentRequestDto): Promise<Comment> {
    const listing = await this.listingRepository.findOne({ where: { id: listingId } });
    if (!listing) {
      throw new NotFoundException('Listing not found');
    }

    const comment = this.commentRepository.create({
      userId: user.id,
      listingId,
      content: dto.content,
    });
    const saved = await this.commentRepository.save(comment);

    if (listing.userId !== user.id) {
      const event: CommentCreatedEvent = {
        listingId: listing.id,
        listingTitle: listing.title,
        listingOwnerId: listing.userId,
        fromUserId: user.id,
        fromUserName: user.name,
      };
      this.eventEmitter.emit(LISTING_DOMAIN_EVENTS.COMMENT_CREATED, event);
    }

    const withUser = await this.commentRepository.findOne({
      where: { id: saved.id },
      relations: ['user'],
    });
    if (!withUser) {
      throw new NotFoundException('Comment not found after create');
    }
    return withUser;
  }
}
