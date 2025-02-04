import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateUserEntityForKyc1738678184777 implements MigrationInterface {
    name = 'UpdateUserEntityForKyc1738678184777'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" ADD "other_name" character varying`);
        await queryRunner.query(`ALTER TABLE "users" ADD "phone" character varying`);
        await queryRunner.query(`ALTER TABLE "users" ADD "dob" date`);
        await queryRunner.query(`CREATE TYPE "public"."users_id_level_enum" AS ENUM('primary', 'secondary')`);
        await queryRunner.query(`ALTER TABLE "users" ADD "id_level" "public"."users_id_level_enum"`);
        await queryRunner.query(`CREATE TYPE "public"."users_id_type_enum" AS ENUM('passport', 'national_id', 'drivers_license')`);
        await queryRunner.query(`ALTER TABLE "users" ADD "id_type" "public"."users_id_type_enum"`);
        await queryRunner.query(`ALTER TABLE "users" ADD "id_number" character varying`);
        await queryRunner.query(`CREATE TYPE "public"."users_id_country_enum" AS ENUM('US', 'NG')`);
        await queryRunner.query(`ALTER TABLE "users" ADD "id_country" "public"."users_id_country_enum"`);
        await queryRunner.query(`ALTER TABLE "users" ADD "bank_id_number" character varying`);
        await queryRunner.query(`CREATE TYPE "public"."users_kyc_level_enum" AS ENUM('basic', 'preliminary')`);
        await queryRunner.query(`ALTER TABLE "users" ADD "kyc_level" "public"."users_kyc_level_enum"`);
        await queryRunner.query(`ALTER TABLE "users" ADD "address" jsonb`);
        await queryRunner.query(`ALTER TABLE "users" ADD "background_information" jsonb`);
        await queryRunner.query(`ALTER TABLE "users" ADD "documents" jsonb`);
        await queryRunner.query(`CREATE TYPE "public"."users_kyc_step_enum" AS ENUM('draft', 'personal_info', 'identification', 'background', 'documents', 'completed')`);
        await queryRunner.query(`ALTER TABLE "users" ADD "kyc_step" "public"."users_kyc_step_enum" NOT NULL DEFAULT 'draft'`);
        await queryRunner.query(`ALTER TABLE "users" ADD "proof_of_address" character varying`);
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "kyc_status"`);
        await queryRunner.query(`CREATE TYPE "public"."users_kyc_status_enum" AS ENUM('pending', 'completed', 'failed')`);
        await queryRunner.query(`ALTER TABLE "users" ADD "kyc_status" "public"."users_kyc_status_enum"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "kyc_status"`);
        await queryRunner.query(`DROP TYPE "public"."users_kyc_status_enum"`);
        await queryRunner.query(`ALTER TABLE "users" ADD "kyc_status" character varying`);
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "proof_of_address"`);
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "kyc_step"`);
        await queryRunner.query(`DROP TYPE "public"."users_kyc_step_enum"`);
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "documents"`);
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "background_information"`);
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "address"`);
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "kyc_level"`);
        await queryRunner.query(`DROP TYPE "public"."users_kyc_level_enum"`);
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "bank_id_number"`);
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "id_country"`);
        await queryRunner.query(`DROP TYPE "public"."users_id_country_enum"`);
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "id_number"`);
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "id_type"`);
        await queryRunner.query(`DROP TYPE "public"."users_id_type_enum"`);
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "id_level"`);
        await queryRunner.query(`DROP TYPE "public"."users_id_level_enum"`);
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "dob"`);
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "phone"`);
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "other_name"`);
    }

}
