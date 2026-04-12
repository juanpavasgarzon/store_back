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
import { REPORT_REASON, type ReportReason } from '../constants/report-reason.constants';
import { REPORT_STATUS, type ReportStatus } from '../constants/report-status.constants';

@Entity('listing_reports')
export class ListingReport {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column('uuid')
  userId!: string;

  @Column('uuid')
  listingId!: string;

  @Column({ type: 'varchar', length: 50, default: REPORT_REASON.OTHER })
  reason!: ReportReason;

  @Column({ type: 'text', nullable: true })
  details!: string | null;

  @Column({ type: 'varchar', length: 20, default: REPORT_STATUS.PENDING })
  status!: ReportStatus;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  user!: User;

  @ManyToOne(() => Listing, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'listingId' })
  listing!: Listing;
}
