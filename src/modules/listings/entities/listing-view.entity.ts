import { Entity, Column, CreateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Listing } from './listing.entity';

import { BaseEntity } from '../../../shared/base.entity';

@Entity('listing_views')
export class ListingView extends BaseEntity {
  @Column('uuid')
  listingId!: string;

  @Column({ type: 'uuid', nullable: true })
  userId!: string | null;

  @Column({ type: 'varchar', length: 45, nullable: true })
  ipAddress!: string | null;

  @CreateDateColumn()
  viewedAt!: Date;

  @ManyToOne(() => Listing, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'listingId' })
  listing!: Listing;
}
