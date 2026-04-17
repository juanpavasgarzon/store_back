import { Entity, Column, CreateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Listing } from './listing.entity';

import { BaseEntity } from '../../../shared/base.entity';

@Entity('contact_requests')
export class ContactRequest extends BaseEntity {
  @Column('uuid')
  userId!: string;

  @Column('uuid')
  listingId!: string;

  @Column({ type: 'text', nullable: true })
  message!: string | null;

  @CreateDateColumn()
  createdAt!: Date;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  user!: User;

  @ManyToOne(() => Listing, (l) => l.contactRequests, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'listingId' })
  listing!: Listing;
}
