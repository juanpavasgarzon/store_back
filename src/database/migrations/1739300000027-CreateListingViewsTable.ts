import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateListingViewsTable1739300000027 implements MigrationInterface {
  async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE "listing_views" (
        "id"        uuid NOT NULL DEFAULT uuid_generate_v4(),
        "listingId" uuid NOT NULL,
        "userId"    uuid,
        "ipAddress" varchar(45),
        "viewedAt"  timestamp NOT NULL DEFAULT now(),
        CONSTRAINT "PK_listing_views" PRIMARY KEY ("id"),
        CONSTRAINT "FK_listing_views_listing"
          FOREIGN KEY ("listingId") REFERENCES "listings"("id") ON DELETE CASCADE
      )
    `);
    await queryRunner.query(`
      CREATE INDEX "IDX_listing_views_listingId" ON "listing_views" ("listingId")
    `);
    await queryRunner.query(`
      CREATE INDEX "IDX_listing_views_viewedAt" ON "listing_views" ("viewedAt")
    `);
  }

  async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE IF EXISTS "listing_views"`);
  }
}
