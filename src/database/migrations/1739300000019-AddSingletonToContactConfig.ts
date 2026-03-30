import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddSingletonToContactConfig1739300000019 implements MigrationInterface {
  async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "contact_config" ADD COLUMN IF NOT EXISTS "singleton" boolean NOT NULL DEFAULT true`,
    );
    await queryRunner.query(
      `DELETE FROM "contact_config" WHERE id NOT IN (SELECT id FROM "contact_config" ORDER BY "createdAt" ASC LIMIT 1)`,
    );
    await queryRunner.query(
      `CREATE UNIQUE INDEX "UQ_contact_config_singleton" ON "contact_config" ("singleton")`,
    );
  }

  async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP INDEX "UQ_contact_config_singleton"`);
    await queryRunner.query(`ALTER TABLE "contact_config" DROP COLUMN "singleton"`);
  }
}
