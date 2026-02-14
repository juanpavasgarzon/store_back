import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm';
import { Category } from '../../categories/entities/category.entity';
import { ListingPhoto } from './listing-photo.entity';
import { ListingVariantValue } from './listing-variant-value.entity';
import { Comment } from './comment.entity';
import { Rating } from './rating.entity';
import { Favorite } from './favorite.entity';
import { ContactRequest } from './contact-request.entity';
import { Appointment } from './appointment.entity';

@Entity('listings')
export class Listing {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 30, unique: true })
  code: string;

  @Column('uuid')
  categoryId: string;

  @Column({ length: 255 })
  title: string;

  @Column({ type: 'text' })
  description: string;

  @Column({ type: 'decimal', precision: 14, scale: 2 })
  price: string;

  @Column({ length: 120 })
  location: string;

  @Column({ type: 'varchar', length: 80, nullable: true })
  sector: string | null;

  @Column({ type: 'decimal', precision: 10, scale: 7, nullable: true })
  latitude: string | null;

  @Column({ type: 'decimal', precision: 10, scale: 7, nullable: true })
  longitude: string | null;

  @Column({ default: true })
  isActive: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne(() => Category, (c) => c.listings, { onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'categoryId' })
  category: Category;

  @OneToMany(() => ListingPhoto, (p) => p.listing, { cascade: true })
  photos: ListingPhoto[];

  @OneToMany(() => ListingVariantValue, (v) => v.listing, { cascade: true })
  variants: ListingVariantValue[];

  @OneToMany(() => Comment, (c) => c.listing)
  comments: Comment[];

  @OneToMany(() => Rating, (r) => r.listing)
  ratings: Rating[];

  @OneToMany(() => Favorite, (f) => f.listing)
  favorites: Favorite[];

  @OneToMany(() => ContactRequest, (cr) => cr.listing)
  contactRequests: ContactRequest[];

  @OneToMany(() => Appointment, (a) => a.listing)
  appointments: Appointment[];
}
