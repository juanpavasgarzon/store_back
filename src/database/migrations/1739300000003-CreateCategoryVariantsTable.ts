import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateCategoryVariantsTable1739300000003 implements MigrationInterface {
  name = 'CreateCategoryVariantsTable1739300000003';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE "category_variants" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "categoryId" uuid NOT NULL,
        "name" character varying(80) NOT NULL,
        "key" character varying(50) NOT NULL,
        "valueType" character varying(20) NOT NULL DEFAULT 'text',
        "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
        "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "PK_category_variants" PRIMARY KEY ("id"),
        CONSTRAINT "FK_category_variants_category" FOREIGN KEY ("categoryId") REFERENCES "categories"("id") ON DELETE CASCADE
      )
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "category_variants"`);
  }
}
