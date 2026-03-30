import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddOriginalFilenameToListingPhotos1739300000022 implements MigrationInterface {
  async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "listing_photos" ADD COLUMN IF NOT EXISTS "originalFilename" VARCHAR(255) NULL`,
    );
  }

  async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "listing_photos" DROP COLUMN IF EXISTS "originalFilename"`,
    );
  }
}
