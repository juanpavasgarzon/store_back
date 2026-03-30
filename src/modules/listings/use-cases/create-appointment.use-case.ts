import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Appointment } from '../entities/appointment.entity';
import { Listing } from '../entities/listing.entity';
import { APPOINTMENT_STATUS } from '../constants/appointment-status.constants';
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
    const scheduledAt = new Date(dto.scheduledAt);
    if (scheduledAt <= new Date()) {
      throw new BadRequestException('scheduledAt must be a future date');
    }
    const appointment = this.appointmentRepository.create({
      userId: user.id,
      listingId,
      scheduledAt,
      status: APPOINTMENT_STATUS.PENDING,
      notes: dto.notes ?? null,
    });
    return this.appointmentRepository.save(appointment);
  }
}
