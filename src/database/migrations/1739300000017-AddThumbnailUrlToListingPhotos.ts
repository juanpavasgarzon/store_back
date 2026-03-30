import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddThumbnailUrlToListingPhotos1739300000017 implements MigrationInterface {
  async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE "listing_photos"
      ADD COLUMN "thumbnailUrl" character varying(512) NULL
    `);
  }

  async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "listing_photos" DROP COLUMN "thumbnailUrl"`);
  }
}
