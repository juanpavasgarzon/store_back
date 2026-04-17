import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Category } from './category.entity';
import {
  ATTRIBUTE_VALUE_TYPE,
  type AttributeValueType,
} from '../constants/attribute-value-type.constants';

@Entity('category_attributes')
export class CategoryAttribute {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column('uuid')
  categoryId!: string;

  @Column({ length: 80 })
  name!: string;

  @Column({ length: 50 })
  key!: string;

  @Column({ type: 'varchar', length: 20, default: ATTRIBUTE_VALUE_TYPE.TEXT })
  valueType!: AttributeValueType;

  @Column({ type: 'jsonb', default: [] })
  options!: string[];

  @Column({ default: false })
  isRequired!: boolean;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;

  @ManyToOne(() => Category, (category) => category.attributes, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'categoryId' })
  category!: Category;
}
