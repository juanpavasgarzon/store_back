import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  OneToMany,
  JoinColumn,
} from 'typeorm';
import { Category } from './category.entity';
import { ListingVariantValue } from '../../listings/entities/listing-variant-value.entity';
import type { VariantValueType } from '../constants/variant-value-type.constants';

@Entity('category_variants')
export class CategoryVariant {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column('uuid')
  categoryId!: string;

  @Column({ length: 80 })
  name!: string;

  @Column({ length: 50 })
  key!: string;

  @Column({ type: 'varchar', length: 20, default: 'text' })
  valueType!: VariantValueType;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;

  @ManyToOne(() => Category, (c) => c.variants, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'categoryId' })
  category!: Category;

  @OneToMany(() => ListingVariantValue, (lv) => lv.categoryVariant)
  listingVariantValues!: ListingVariantValue[];
}
