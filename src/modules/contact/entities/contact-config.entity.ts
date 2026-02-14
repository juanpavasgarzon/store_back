import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('contact_config')
export class ContactConfig {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 255 })
  recipientEmail: string;

  @Column({ type: 'varchar', length: 500, nullable: true })
  subjectTemplate: string | null;

  @Column({ type: 'text', nullable: true })
  messageTemplate: string | null;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
