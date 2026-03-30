import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddUniqueConstraintsFavoritesRatings1739300000018 implements MigrationInterface {
  async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "favorites" ADD CONSTRAINT "UQ_favorites_userId_listingId" UNIQUE ("userId", "listingId")`,
    );
    await queryRunner.query(
      `ALTER TABLE "ratings" ADD CONSTRAINT "UQ_ratings_userId_listingId" UNIQUE ("userId", "listingId")`,
    );
  }

  async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "ratings" DROP CONSTRAINT "UQ_ratings_userId_listingId"`);
    await queryRunner.query(
      `ALTER TABLE "favorites" DROP CONSTRAINT "UQ_favorites_userId_listingId"`,
    );
  }
}
