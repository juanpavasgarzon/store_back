import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddTokenPrefixToRefreshTokens1739300000030 implements MigrationInterface {
  async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE "refresh_tokens"
      ADD COLUMN "tokenPrefix" varchar(16) NOT NULL DEFAULT ''
    `);
    await queryRunner.query(`
      CREATE INDEX "IDX_refresh_tokens_tokenPrefix" ON "refresh_tokens" ("tokenPrefix")
    `);
    await queryRunner.query(`
      ALTER TABLE "refresh_tokens" ALTER COLUMN "tokenPrefix" DROP DEFAULT
    `);
  }

  async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP INDEX IF EXISTS "IDX_refresh_tokens_tokenPrefix"`);
    await queryRunner.query(`ALTER TABLE "refresh_tokens" DROP COLUMN "tokenPrefix"`);
  }
}
