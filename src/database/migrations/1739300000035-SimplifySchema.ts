import type { MigrationInterface, QueryRunner } from 'typeorm';

export class SimplifySchema1739300000035 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE IF EXISTS "appointments" CASCADE`);
    await queryRunner.query(`DROP TABLE IF EXISTS "comments" CASCADE`);
    await queryRunner.query(`DROP TABLE IF EXISTS "ratings" CASCADE`);
    await queryRunner.query(`DROP TABLE IF EXISTS "favorite_collections" CASCADE`);
    await queryRunner.query(`DROP TABLE IF EXISTS "listing_variant_values" CASCADE`);
    await queryRunner.query(`DROP TABLE IF EXISTS "category_variants" CASCADE`);
    await queryRunner.query(`DROP TABLE IF EXISTS "listing_price_history" CASCADE`);
    await queryRunner.query(`DROP TABLE IF EXISTS "legal_documents" CASCADE`);
    await queryRunner.query(`DROP TABLE IF EXISTS "contact_config" CASCADE`);

    await queryRunner.query(`ALTER TABLE "contact_requests" DROP COLUMN IF EXISTS "status"`);
    await queryRunner.query(`ALTER TABLE "contact_requests" DROP COLUMN IF EXISTS "respondedAt"`);
    await queryRunner.query(`ALTER TABLE "contact_requests" DROP COLUMN IF EXISTS "updatedAt"`);

    await queryRunner.query(`ALTER TABLE "listings" ADD COLUMN IF NOT EXISTS "city" varchar(80) NULL`);

    await queryRunner.query(`ALTER TABLE "users" ADD COLUMN IF NOT EXISTS "phone" varchar(20) NULL`);
    await queryRunner.query(`ALTER TABLE "users" ADD COLUMN IF NOT EXISTS "whatsapp" varchar(20) NULL`);
    await queryRunner.query(`ALTER TABLE "users" ADD COLUMN IF NOT EXISTS "city" varchar(80) NULL`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "users" DROP COLUMN IF EXISTS "city"`);
    await queryRunner.query(`ALTER TABLE "users" DROP COLUMN IF EXISTS "whatsapp"`);
    await queryRunner.query(`ALTER TABLE "users" DROP COLUMN IF EXISTS "phone"`);
    await queryRunner.query(`ALTER TABLE "listings" DROP COLUMN IF EXISTS "city"`);
    await queryRunner.query(`ALTER TABLE "contact_requests" ADD COLUMN IF NOT EXISTS "updatedAt" timestamptz NOT NULL DEFAULT now()`);
    await queryRunner.query(`ALTER TABLE "contact_requests" ADD COLUMN IF NOT EXISTS "respondedAt" timestamptz NULL`);
    await queryRunner.query(`ALTER TABLE "contact_requests" ADD COLUMN IF NOT EXISTS "status" varchar(20) NOT NULL DEFAULT 'pending'`);
  }
}
