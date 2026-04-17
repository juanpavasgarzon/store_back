import { Entity, Column, CreateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Listing } from './listing.entity';
import { CategoryAttribute } from '../../categories/entities/category-attribute.entity';

import { BaseEntity } from '../../../shared/base.entity';

@Entity('listing_attribute_values')
export class ListingAttributeValue extends BaseEntity {
  @Column('uuid')
  listingId!: string;

  @Column('uuid')
  attributeId!: string;

  @Column({ type: 'text' })
  value!: string;

  @CreateDateColumn()
  createdAt!: Date;

  @ManyToOne(() => Listing, (listing) => listing.attributeValues, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'listingId' })
  listing!: Listing;

  @ManyToOne(() => CategoryAttribute, { onDelete: 'CASCADE', eager: true })
  @JoinColumn({ name: 'attributeId' })
  attribute!: CategoryAttribute;
}
