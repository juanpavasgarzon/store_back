import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateContactConfigTable1739300000010 implements MigrationInterface {
  name = 'CreateContactConfigTable1739300000010';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE "contact_config" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "recipientEmail" character varying(255) NOT NULL,
        "subjectTemplate" character varying(500),
        "messageTemplate" text,
        "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
        "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "PK_contact_config" PRIMARY KEY ("id")
      )
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "contact_config"`);
  }
}
