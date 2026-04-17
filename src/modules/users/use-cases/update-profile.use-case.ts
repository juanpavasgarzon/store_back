import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../entities/user.entity';
import type { IUser } from '../../../shared';
import type { UpdateProfileRequestDto } from '../dto/request/update-profile.dto';

@Injectable()
export class UpdateProfileUseCase {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async execute(currentUser: IUser, dto: UpdateProfileRequestDto): Promise<User> {
    const user = await this.userRepository.findOne({ where: { id: currentUser.id } });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    user.name = dto.name;
    if (dto.phone !== undefined) {
      user.phone = dto.phone ?? null;
    }
    if (dto.whatsapp !== undefined) {
      user.whatsapp = dto.whatsapp ?? null;
    }
    if (dto.city !== undefined) {
      user.city = dto.city ?? null;
    }
    return this.userRepository.save(user);
  }
}
