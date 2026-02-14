import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddFilenameToListingPhotos1739300000014 implements MigrationInterface {
  name = 'AddFilenameToListingPhotos1739300000014';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE "listing_photos"
      ADD COLUMN "filename" character varying(255)
    `);
    await queryRunner.query(`
      UPDATE "listing_photos"
      SET "filename" = SUBSTRING("url" FROM '[^/]+$')
      WHERE "filename" IS NULL
    `);
    await queryRunner.query(`
      ALTER TABLE "listing_photos"
      ALTER COLUMN "filename" SET NOT NULL
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE "listing_photos"
      DROP COLUMN "filename"
    `);
  }
}
