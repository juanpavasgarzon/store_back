import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddOptionsToCategoryVariants1739300000034 implements MigrationInterface {
  async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE "category_variants"
        ADD COLUMN IF NOT EXISTS "options" jsonb NOT NULL DEFAULT '[]'
    `);
  }

  async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "category_variants" DROP COLUMN IF EXISTS "options"`);
  }
}
