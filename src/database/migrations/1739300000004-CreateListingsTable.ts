import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateListingsTable1739300000004 implements MigrationInterface {
  name = 'CreateListingsTable1739300000004';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE "listings" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "code" character varying(30) NOT NULL,
        "categoryId" uuid NOT NULL,
        "title" character varying(255) NOT NULL,
        "description" text NOT NULL,
        "price" decimal(14,2) NOT NULL,
        "location" character varying(120) NOT NULL,
        "sector" character varying(80),
        "latitude" decimal(10,7),
        "longitude" decimal(10,7),
        "isActive" boolean NOT NULL DEFAULT true,
        "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
        "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "UQ_listings_code" UNIQUE ("code"),
        CONSTRAINT "PK_listings" PRIMARY KEY ("id"),
        CONSTRAINT "FK_listings_category" FOREIGN KEY ("categoryId") REFERENCES "categories"("id") ON DELETE RESTRICT
      )
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "listings"`);
  }
}
