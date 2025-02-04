import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateUserEntity1738683589777 implements MigrationInterface {
    name = 'UpdateUserEntity1738683589777'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "kyc_status"`);
        await queryRunner.query(`DROP TYPE "public"."users_kyc_status_enum"`);
        await queryRunner.query(`ALTER TABLE "users" ADD "kyc_status" character varying`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "kyc_status"`);
        await queryRunner.query(`CREATE TYPE "public"."users_kyc_status_enum" AS ENUM('pending', 'completed', 'failed')`);
        await queryRunner.query(`ALTER TABLE "users" ADD "kyc_status" "public"."users_kyc_status_enum"`);
    }

}
