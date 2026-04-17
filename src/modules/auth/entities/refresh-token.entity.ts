import { Entity, Column, CreateDateColumn, ManyToOne, JoinColumn, Index } from 'typeorm';
import { User } from '../../users/entities/user.entity';

import { BaseEntity } from '../../../shared/base.entity';

@Entity('refresh_tokens')
export class RefreshToken extends BaseEntity {
  @Column('uuid')
  userId!: string;

  @Index()
  @Column({ type: 'varchar', length: 16 })
  tokenPrefix!: string;

  @Column({ type: 'varchar', length: 255 })
  tokenHash!: string;

  @Column({ type: 'timestamp' })
  expiresAt!: Date;

  @Column({ type: 'timestamp', nullable: true })
  revokedAt!: Date | null;

  @CreateDateColumn()
  createdAt!: Date;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  user!: User;
}
