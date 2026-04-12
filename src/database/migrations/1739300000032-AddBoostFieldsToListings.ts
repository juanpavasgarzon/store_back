import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddBoostFieldsToListings1739300000032 implements MigrationInterface {
  async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "listings" ADD COLUMN "isBoosted" boolean NOT NULL DEFAULT false`,
    );
    await queryRunner.query(`ALTER TABLE "listings" ADD COLUMN "boostedUntil" timestamp NULL`);
  }

  async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "listings" DROP COLUMN "boostedUntil"`);
    await queryRunner.query(`ALTER TABLE "listings" DROP COLUMN "isBoosted"`);
  }
}
