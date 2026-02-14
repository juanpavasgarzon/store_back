import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateLegalDocumentsTable1739300000013 implements MigrationInterface {
  name = 'CreateLegalDocumentsTable1739300000013';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE "legal_documents" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "slug" character varying(50) NOT NULL,
        "title" character varying(120) NOT NULL,
        "content" text NOT NULL,
        "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
        "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "UQ_legal_documents_slug" UNIQUE ("slug"),
        CONSTRAINT "PK_legal_documents" PRIMARY KEY ("id")
      )
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "legal_documents"`);
  }
}
