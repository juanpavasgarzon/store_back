import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Comment } from '../entities/comment.entity';
import { Listing } from '../entities/listing.entity';
import type { IUser } from '../../../shared';
import type { CreateCommentRequestDto } from '../dto/request/create-comment.dto';

@Injectable()
export class CreateCommentUseCase {
  constructor(
    @InjectRepository(Comment)
    private readonly commentRepository: Repository<Comment>,
    @InjectRepository(Listing)
    private readonly listingRepository: Repository<Listing>,
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
    return this.commentRepository.save(comment);
  }
}
