import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { Listing } from '../../listings/entities/listing.entity';
import { CategoryAttribute } from './category-attribute.entity';

@Entity('categories')
export class Category {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ length: 100 })
  name!: string;

  @Column({ length: 50, unique: true })
  slug!: string;

  @Column({ type: 'text', nullable: true })
  description!: string | null;

  @Column({ default: true })
  isActive!: boolean;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;

  @OneToMany(() => Listing, (listing) => listing.category)
  listings!: Listing[];

  @OneToMany(() => CategoryAttribute, (attribute) => attribute.category, { cascade: true })
  attributes!: CategoryAttribute[];
}
