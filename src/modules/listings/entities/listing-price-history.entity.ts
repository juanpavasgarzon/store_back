import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Listing } from './listing.entity';

@Entity('listing_price_history')
export class ListingPriceHistory {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column('uuid')
  listingId!: string;

  @Column({ type: 'decimal', precision: 14, scale: 2 })
  price!: string;

  @Column({ type: 'uuid', nullable: true })
  changedByUserId!: string | null;

  @CreateDateColumn()
  changedAt!: Date;

  @ManyToOne(() => Listing, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'listingId' })
  listing!: Listing;
}
