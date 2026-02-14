import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateListingVariantValuesTable1739300000006 implements MigrationInterface {
  name = 'CreateListingVariantValuesTable1739300000006';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE "listing_variant_values" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "listingId" uuid NOT NULL,
        "categoryVariantId" uuid NOT NULL,
        "value" text NOT NULL,
        "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
        "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "PK_listing_variant_values" PRIMARY KEY ("id"),
        CONSTRAINT "FK_listing_variant_values_listing" FOREIGN KEY ("listingId") REFERENCES "listings"("id") ON DELETE CASCADE,
        CONSTRAINT "FK_listing_variant_values_variant" FOREIGN KEY ("categoryVariantId") REFERENCES "category_variants"("id") ON DELETE CASCADE
      )
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "listing_variant_values"`);
  }
}
