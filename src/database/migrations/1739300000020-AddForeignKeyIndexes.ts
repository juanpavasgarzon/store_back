import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddForeignKeyIndexes1739300000020 implements MigrationInterface {
  async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE INDEX IF NOT EXISTS "IDX_listings_userId" ON "listings" ("userId")`,
    );
    await queryRunner.query(
      `CREATE INDEX IF NOT EXISTS "IDX_listings_categoryId" ON "listings" ("categoryId")`,
    );
    await queryRunner.query(
      `CREATE INDEX IF NOT EXISTS "IDX_comments_listingId" ON "comments" ("listingId")`,
    );
    await queryRunner.query(
      `CREATE INDEX IF NOT EXISTS "IDX_ratings_listingId" ON "ratings" ("listingId")`,
    );
    await queryRunner.query(
      `CREATE INDEX IF NOT EXISTS "IDX_favorites_userId" ON "favorites" ("userId")`,
    );
  }

  async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP INDEX IF EXISTS "IDX_favorites_userId"`);
    await queryRunner.query(`DROP INDEX IF EXISTS "IDX_ratings_listingId"`);
    await queryRunner.query(`DROP INDEX IF EXISTS "IDX_comments_listingId"`);
    await queryRunner.query(`DROP INDEX IF EXISTS "IDX_listings_categoryId"`);
    await queryRunner.query(`DROP INDEX IF EXISTS "IDX_listings_userId"`);
  }
}
