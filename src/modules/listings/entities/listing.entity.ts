import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  ManyToOne,
  JoinColumn,
  OneToMany,
  Index,
} from 'typeorm';
import { Category } from '../../categories/entities/category.entity';
import { User } from '../../users/entities/user.entity';
import { LISTING_STATUS, type ListingStatus } from '../constants/listing-status.constants';
import { ListingPhoto } from './listing-photo.entity';
import { Favorite } from './favorite.entity';
import { ContactRequest } from './contact-request.entity';
import { ListingAttributeValue } from './listing-attribute-value.entity';

@Entity('listings')
export class Listing {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ length: 30, unique: true })
  code!: string;

  @Column('uuid')
  userId!: string;

  @Column('uuid')
  categoryId!: string;

  @Column({ length: 255 })
  title!: string;

  @Column({ type: 'text' })
  description!: string;

  @Column({ type: 'decimal', precision: 14, scale: 2 })
  price!: string;

  @Column({ length: 120 })
  location!: string;

  @Column({ type: 'varchar', length: 80, nullable: true })
  city!: string | null;

  @Column({ type: 'varchar', length: 80, nullable: true })
  sector!: string | null;

  @Column({ type: 'decimal', precision: 10, scale: 7, nullable: true })
  latitude!: string | null;

  @Column({ type: 'decimal', precision: 10, scale: 7, nullable: true })
  longitude!: string | null;

  @Column({ type: 'varchar', length: 20, default: LISTING_STATUS.ACTIVE })
  status!: ListingStatus;

  @Column({ type: 'timestamp', nullable: true })
  expiresAt!: Date | null;

  @Column({ default: true })
  isActive!: boolean;

  @Column({ default: false })
  isBoosted!: boolean;

  @Column({ type: 'timestamp', nullable: true })
  boostedUntil!: Date | null;

  @Index({ spatial: false })
  @Column({ type: 'tsvector', nullable: true, select: false, insert: false, update: false })
  searchVector!: unknown;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;

  @DeleteDateColumn({ nullable: true })
  deletedAt!: Date | null;

  @ManyToOne(() => Category, (c) => c.listings, { onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'categoryId' })
  category!: Category;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  user!: User;

  @OneToMany(() => ListingPhoto, (p) => p.listing, { cascade: true })
  photos!: ListingPhoto[];

  @OneToMany(() => Favorite, (f) => f.listing)
  favorites!: Favorite[];

  @OneToMany(() => ContactRequest, (contactRequest) => contactRequest.listing)
  contactRequests!: ContactRequest[];

  @OneToMany(() => ListingAttributeValue, (attributeValue) => attributeValue.listing, {
    cascade: true,
  })
  attributeValues!: ListingAttributeValue[];
}
