import { Entity, Column, CreateDateColumn, UpdateDateColumn, DeleteDateColumn } from 'typeorm';
import type { Role } from '../../../shared';
import { ROLES } from '../../../shared/security';

import { BaseEntity } from '../../../shared/base.entity';

@Entity('users')
export class User extends BaseEntity {
  @Column({ unique: true })
  email!: string;

  @Column()
  passwordHash!: string;

  @Column({ length: 120 })
  name!: string;

  @Column({ type: 'varchar', length: 20, nullable: true })
  phone!: string | null;

  @Column({ type: 'varchar', length: 80, nullable: true })
  city!: string | null;

  @Column({ type: 'varchar', length: 20, default: ROLES.USER })
  role!: Role;

  @Column({ default: true })
  isActive!: boolean;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;

  @DeleteDateColumn({ nullable: true })
  deletedAt!: Date | null;
}
