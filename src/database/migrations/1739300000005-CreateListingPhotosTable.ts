import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateListingPhotosTable1739300000005 implements MigrationInterface {
  name = 'CreateListingPhotosTable1739300000005';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE "listing_photos" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "listingId" uuid NOT NULL,
        "url" character varying(512) NOT NULL,
        "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
        "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "PK_listing_photos" PRIMARY KEY ("id"),
        CONSTRAINT "FK_listing_photos_listing" FOREIGN KEY ("listingId") REFERENCES "listings"("id") ON DELETE CASCADE
      )
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "listing_photos"`);
  }
}
