import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddUserIdToListings1739300000015 implements MigrationInterface {
  async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE "listings"
      ADD COLUMN "userId" uuid
    `);

    await queryRunner.query(`
      UPDATE "listings"
      SET "userId" = (SELECT id FROM "users" ORDER BY "createdAt" ASC LIMIT 1)
      WHERE "userId" IS NULL
    `);

    await queryRunner.query(`
      ALTER TABLE "listings"
      ALTER COLUMN "userId" SET NOT NULL
    `);

    await queryRunner.query(`
      ALTER TABLE "listings"
      ADD CONSTRAINT "FK_listings_userId"
      FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE
    `);
  }

  async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE "listings"
      DROP CONSTRAINT "FK_listings_userId"
    `);

    await queryRunner.query(`
      ALTER TABLE "listings"
      DROP COLUMN "userId"
    `);
  }
}
