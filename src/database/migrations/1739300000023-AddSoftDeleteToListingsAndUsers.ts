import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddSoftDeleteToListingsAndUsers1739300000023 implements MigrationInterface {
  async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "listings" ADD COLUMN IF NOT EXISTS "deletedAt" TIMESTAMPTZ NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "users" ADD COLUMN IF NOT EXISTS "deletedAt" TIMESTAMPTZ NULL`,
    );
  }

  async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "users" DROP COLUMN IF EXISTS "deletedAt"`);
    await queryRunner.query(`ALTER TABLE "listings" DROP COLUMN IF EXISTS "deletedAt"`);
  }
}
