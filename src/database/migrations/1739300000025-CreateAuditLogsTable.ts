import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateAuditLogsTable1739300000025 implements MigrationInterface {
  async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE "audit_logs" (
        "id"        uuid NOT NULL DEFAULT uuid_generate_v4(),
        "actorId"   uuid,
        "action"    varchar(80) NOT NULL,
        "entity"    varchar(80) NOT NULL,
        "entityId"  uuid,
        "before"    jsonb,
        "after"     jsonb,
        "createdAt" timestamp NOT NULL DEFAULT now(),
        CONSTRAINT "PK_audit_logs" PRIMARY KEY ("id")
      )
    `);
    await queryRunner.query(`
      CREATE INDEX "IDX_audit_logs_actorId" ON "audit_logs" ("actorId")
    `);
    await queryRunner.query(`
      CREATE INDEX "IDX_audit_logs_entityId" ON "audit_logs" ("entity", "entityId")
    `);
    await queryRunner.query(`
      CREATE INDEX "IDX_audit_logs_createdAt" ON "audit_logs" ("createdAt")
    `);
  }

  async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE IF EXISTS "audit_logs"`);
  }
}
