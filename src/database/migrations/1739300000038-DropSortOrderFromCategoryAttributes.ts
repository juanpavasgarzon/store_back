import type { MigrationInterface, QueryRunner } from 'typeorm';

export class DropSortOrderFromCategoryAttributes1739300000038 implements MigrationInterface {
  name = 'DropSortOrderFromCategoryAttributes1739300000038';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "category_attributes" DROP COLUMN IF EXISTS "sortOrder"`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "category_attributes" ADD COLUMN IF NOT EXISTS "sortOrder" integer NOT NULL DEFAULT 0`,
    );
  }
}
