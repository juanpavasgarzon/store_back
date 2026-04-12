import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateListingReportsTable1739300000026 implements MigrationInterface {
  async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE "listing_reports" (
        "id"        uuid NOT NULL DEFAULT uuid_generate_v4(),
        "userId"    uuid NOT NULL,
        "listingId" uuid NOT NULL,
        "reason"    varchar(50) NOT NULL DEFAULT 'other',
        "details"   text,
        "status"    varchar(20) NOT NULL DEFAULT 'pending',
        "createdAt" timestamp NOT NULL DEFAULT now(),
        "updatedAt" timestamp NOT NULL DEFAULT now(),
        CONSTRAINT "PK_listing_reports" PRIMARY KEY ("id"),
        CONSTRAINT "FK_listing_reports_user"
          FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE,
        CONSTRAINT "FK_listing_reports_listing"
          FOREIGN KEY ("listingId") REFERENCES "listings"("id") ON DELETE CASCADE
      )
    `);
    await queryRunner.query(`
      CREATE INDEX "IDX_listing_reports_listingId" ON "listing_reports" ("listingId")
    `);
    await queryRunner.query(`
      CREATE INDEX "IDX_listing_reports_status" ON "listing_reports" ("status")
    `);
  }

  async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE IF EXISTS "listing_reports"`);
  }
}
