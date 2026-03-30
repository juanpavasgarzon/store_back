import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddStatusToListings1739300000016 implements MigrationInterface {
  async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE "listings"
      ADD COLUMN "status" character varying(20) NOT NULL DEFAULT 'active'
    `);

    await queryRunner.query(`
      ALTER TABLE "listings"
      ADD COLUMN "expiresAt" timestamp NULL
    `);
  }

  async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "listings" DROP COLUMN "expiresAt"`);
    await queryRunner.query(`ALTER TABLE "listings" DROP COLUMN "status"`);
  }
}
