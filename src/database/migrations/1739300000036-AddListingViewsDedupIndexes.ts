import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddListingViewsDedupIndexes1739300000036 implements MigrationInterface {
  async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE INDEX "IDX_listing_views_listingId_userId_viewedAt"
        ON "listing_views" ("listingId", "userId", "viewedAt")
        WHERE "userId" IS NOT NULL
    `);
    await queryRunner.query(`
      CREATE INDEX "IDX_listing_views_listingId_ipAddress_viewedAt"
        ON "listing_views" ("listingId", "ipAddress", "viewedAt")
        WHERE "ipAddress" IS NOT NULL
    `);
  }

  async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP INDEX IF EXISTS "IDX_listing_views_listingId_userId_viewedAt"`);
    await queryRunner.query(`DROP INDEX IF EXISTS "IDX_listing_views_listingId_ipAddress_viewedAt"`);
  }
}
