import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Listing } from './listing.entity';
import type { ContactRequestStatus } from '../constants/contact-request-status.constants';
import { CONTACT_REQUEST_STATUS } from '../constants/contact-request-status.constants';

@Entity('contact_requests')
export class ContactRequest {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('uuid')
  userId: string;

  @Column('uuid')
  listingId: string;

  @Column({ type: 'text', nullable: true })
  message: string | null;

  @Column({ length: 20, default: CONTACT_REQUEST_STATUS.PENDING })
  status: ContactRequestStatus;

  @Column({ type: 'timestamptz', nullable: true })
  respondedAt: Date | null;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  user: User;

  @ManyToOne(() => Listing, (l) => l.contactRequests, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'listingId' })
  listing: Listing;
}
