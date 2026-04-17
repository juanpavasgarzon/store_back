import { Entity, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Listing } from './listing.entity';

import { BaseEntity } from '../../../shared/base.entity';

@Entity('listing_photos')
export class ListingPhoto extends BaseEntity {
  @Column('uuid')
  listingId!: string;

  @Column({ length: 255 })
  filename!: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  originalFilename!: string | null;

  @Column({ length: 512 })
  url!: string;

  @Column({ type: 'varchar', length: 512, nullable: true })
  thumbnailUrl!: string | null;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;

  @ManyToOne(() => Listing, (l) => l.photos, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'listingId' })
  listing!: Listing;
}
