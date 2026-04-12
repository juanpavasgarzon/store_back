import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateListingPriceHistoryTable1739300000028 implements MigrationInterface {
  async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE "listing_price_history" (
        "id"              uuid NOT NULL DEFAULT uuid_generate_v4(),
        "listingId"       uuid NOT NULL,
        "price"           decimal(14,2) NOT NULL,
        "changedByUserId" uuid,
        "changedAt"       timestamp NOT NULL DEFAULT now(),
        CONSTRAINT "PK_listing_price_history" PRIMARY KEY ("id"),
        CONSTRAINT "FK_listing_price_history_listing"
          FOREIGN KEY ("listingId") REFERENCES "listings"("id") ON DELETE CASCADE
      )
    `);
    await queryRunner.query(`
      CREATE INDEX "IDX_listing_price_history_listingId" ON "listing_price_history" ("listingId")
    `);
  }

  async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE IF EXISTS "listing_price_history"`);
  }
}
