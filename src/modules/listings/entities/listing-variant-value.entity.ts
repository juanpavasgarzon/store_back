import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Listing } from './listing.entity';
import { CategoryVariant } from '../../categories/entities/category-variant.entity';

@Entity('listing_variant_values')
export class ListingVariantValue {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('uuid')
  listingId: string;

  @Column('uuid')
  categoryVariantId: string;

  @Column({ type: 'text' })
  value: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne(() => Listing, (l) => l.variants, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'listingId' })
  listing: Listing;

  @ManyToOne(() => CategoryVariant, (cv) => cv.listingVariantValues, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'categoryVariantId' })
  categoryVariant: CategoryVariant;
}
