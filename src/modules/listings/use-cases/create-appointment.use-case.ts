import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Appointment } from '../entities/appointment.entity';
import { Listing } from '../entities/listing.entity';
import type { IUser } from '../../../shared';
import type { CreateAppointmentRequestDto } from '../dto/request/create-appointment.dto';

@Injectable()
export class CreateAppointmentUseCase {
  constructor(
    @InjectRepository(Appointment)
    private readonly appointmentRepository: Repository<Appointment>,
    @InjectRepository(Listing)
    private readonly listingRepository: Repository<Listing>,
  ) {}

  async execute(
    listingId: string,
    user: IUser,
    dto: CreateAppointmentRequestDto,
  ): Promise<Appointment> {
    const listing = await this.listingRepository.findOne({ where: { id: listingId } });
    if (!listing) {
      throw new NotFoundException('Listing not found');
    }
    const appointment = this.appointmentRepository.create({
      userId: user.id,
      listingId,
      scheduledAt: new Date(dto.scheduledAt),
      status: 'pending',
      notes: dto.notes ?? null,
    });
    return this.appointmentRepository.save(appointment);
  }
}
