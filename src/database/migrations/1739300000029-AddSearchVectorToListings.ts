import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddSearchVectorToListings1739300000029 implements MigrationInterface {
  async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE "listings" ADD COLUMN "searchVector" tsvector
    `);

    await queryRunner.query(`
      UPDATE "listings"
      SET "searchVector" = to_tsvector('spanish',
        coalesce(title, '') || ' ' ||
        coalesce(description, '') || ' ' ||
        coalesce(location, '') || ' ' ||
        coalesce(sector, '')
      )
    `);

    await queryRunner.query(`
      CREATE INDEX "IDX_listings_search_vector" ON "listings" USING GIN("searchVector")
    `);

    await queryRunner.query(`
      CREATE OR REPLACE FUNCTION listings_search_vector_update() RETURNS trigger AS $$
      BEGIN
        NEW."searchVector" := to_tsvector('spanish',
          coalesce(NEW.title, '') || ' ' ||
          coalesce(NEW.description, '') || ' ' ||
          coalesce(NEW.location, '') || ' ' ||
          coalesce(NEW.sector, '')
        );
        RETURN NEW;
      END;
      $$ LANGUAGE plpgsql;
    `);

    await queryRunner.query(`
      CREATE TRIGGER listings_search_vector_trigger
        BEFORE INSERT OR UPDATE ON "listings"
        FOR EACH ROW EXECUTE FUNCTION listings_search_vector_update()
    `);
  }

  async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TRIGGER IF EXISTS listings_search_vector_trigger ON "listings"`);
    await queryRunner.query(`DROP FUNCTION IF EXISTS listings_search_vector_update()`);
    await queryRunner.query(`DROP INDEX IF EXISTS "IDX_listings_search_vector"`);
    await queryRunner.query(`ALTER TABLE "listings" DROP COLUMN IF EXISTS "searchVector"`);
  }
}
