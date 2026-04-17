import type { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateCategoryAttributesTable1739300000037 implements MigrationInterface {
  name = 'CreateCategoryAttributesTable1739300000037';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE "category_attributes" (
        "id"          uuid            NOT NULL DEFAULT uuid_generate_v4(),
        "categoryId"  uuid            NOT NULL,
        "name"        varchar(80)     NOT NULL,
        "key"         varchar(50)     NOT NULL,
        "valueType"   varchar(20)     NOT NULL DEFAULT 'text',
        "options"     jsonb           NOT NULL DEFAULT '[]',
        "isRequired"  boolean         NOT NULL DEFAULT false,
        "sortOrder"   integer         NOT NULL DEFAULT 0,
        "createdAt"   TIMESTAMP       NOT NULL DEFAULT now(),
        "updatedAt"   TIMESTAMP       NOT NULL DEFAULT now(),
        CONSTRAINT "PK_category_attributes" PRIMARY KEY ("id"),
        CONSTRAINT "FK_category_attributes_category"
          FOREIGN KEY ("categoryId") REFERENCES "categories"("id") ON DELETE CASCADE
      )
    `);

    await queryRunner.query(`
      CREATE INDEX "IDX_category_attributes_categoryId"
        ON "category_attributes" ("categoryId")
    `);

    await queryRunner.query(`
      CREATE TABLE "listing_attribute_values" (
        "id"          uuid        NOT NULL DEFAULT uuid_generate_v4(),
        "listingId"   uuid        NOT NULL,
        "attributeId" uuid        NOT NULL,
        "value"       text        NOT NULL,
        "createdAt"   TIMESTAMP   NOT NULL DEFAULT now(),
        CONSTRAINT "PK_listing_attribute_values" PRIMARY KEY ("id"),
        CONSTRAINT "FK_listing_attribute_values_listing"
          FOREIGN KEY ("listingId") REFERENCES "listings"("id") ON DELETE CASCADE,
        CONSTRAINT "FK_listing_attribute_values_attribute"
          FOREIGN KEY ("attributeId") REFERENCES "category_attributes"("id") ON DELETE CASCADE,
        CONSTRAINT "UQ_listing_attribute_values_listing_attribute"
          UNIQUE ("listingId", "attributeId")
      )
    `);

    await queryRunner.query(`
      CREATE INDEX "IDX_listing_attribute_values_listingId"
        ON "listing_attribute_values" ("listingId")
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE IF EXISTS "listing_attribute_values" CASCADE`);
    await queryRunner.query(`DROP TABLE IF EXISTS "category_attributes" CASCADE`);
  }
}
