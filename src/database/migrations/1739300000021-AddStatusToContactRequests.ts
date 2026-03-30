import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddStatusToContactRequests1739300000021 implements MigrationInterface {
  async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "contact_requests" ADD COLUMN IF NOT EXISTS "status" VARCHAR(20) NOT NULL DEFAULT 'pending'`,
    );
    await queryRunner.query(
      `ALTER TABLE "contact_requests" ADD COLUMN IF NOT EXISTS "respondedAt" TIMESTAMPTZ NULL`,
    );
  }

  async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "contact_requests" DROP COLUMN IF EXISTS "respondedAt"`);
    await queryRunner.query(`ALTER TABLE "contact_requests" DROP COLUMN IF EXISTS "status"`);
  }
}
