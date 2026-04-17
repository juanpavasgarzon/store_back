import type { MigrationInterface, QueryRunner } from 'typeorm';

export class DropWhatsappFromUsers1739300000039 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "users" DROP COLUMN IF EXISTS "whatsapp"`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "users" ADD COLUMN IF NOT EXISTS "whatsapp" varchar(20) NULL`,
    );
  }
}
