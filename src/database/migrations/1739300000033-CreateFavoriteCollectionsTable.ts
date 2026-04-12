import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateFavoriteCollectionsTable1739300000033 implements MigrationInterface {
  async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE "favorite_collections" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "userId" uuid NOT NULL,
        "name" varchar(80) NOT NULL,
        "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
        "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "PK_favorite_collections" PRIMARY KEY ("id"),
        CONSTRAINT "FK_favorite_collections_user" FOREIGN KEY ("userId")
          REFERENCES "users"("id") ON DELETE CASCADE
      )
    `);
    await queryRunner.query(
      `CREATE INDEX "IDX_favorite_collections_userId" ON "favorite_collections" ("userId")`,
    );
    await queryRunner.query(`ALTER TABLE "favorites" ADD COLUMN "collectionId" uuid NULL`);
    await queryRunner.query(`
      ALTER TABLE "favorites"
        ADD CONSTRAINT "FK_favorites_collection"
        FOREIGN KEY ("collectionId")
        REFERENCES "favorite_collections"("id") ON DELETE SET NULL
    `);
    await queryRunner.query(
      `CREATE INDEX "IDX_favorites_collectionId" ON "favorites" ("collectionId")`,
    );
  }

  async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP INDEX "IDX_favorites_collectionId"`);
    await queryRunner.query(`ALTER TABLE "favorites" DROP CONSTRAINT "FK_favorites_collection"`);
    await queryRunner.query(`ALTER TABLE "favorites" DROP COLUMN "collectionId"`);
    await queryRunner.query(`DROP INDEX "IDX_favorite_collections_userId"`);
    await queryRunner.query(`DROP TABLE "favorite_collections"`);
  }
}
