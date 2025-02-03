import { MigrationInterface, QueryRunner } from "typeorm";

export class OptimizeBusinessEntity1738579082670 implements MigrationInterface {
    name = 'OptimizeBusinessEntity1738579082670'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "businesses" DROP COLUMN "id_upload"`);
        await queryRunner.query(`ALTER TABLE "businesses" ADD "business_registration_doc" character varying`);
        await queryRunner.query(`ALTER TABLE "businesses" ADD "proof_of_address_doc" character varying`);
        await queryRunner.query(`CREATE TYPE "public"."businesses_registration_status_enum" AS ENUM('draft', 'basic_info_completed', 'identification_completed', 'documents_completed', 'completed')`);
        await queryRunner.query(`ALTER TABLE "businesses" ADD "registration_status" "public"."businesses_registration_status_enum" NOT NULL DEFAULT 'draft'`);
        await queryRunner.query(`ALTER TABLE "businesses" ALTER COLUMN "name" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "businesses" ALTER COLUMN "business_type" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "businesses" ALTER COLUMN "business_type" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "businesses" ALTER COLUMN "industry" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "businesses" ALTER COLUMN "industry" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "businesses" ALTER COLUMN "address" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "businesses" ALTER COLUMN "id_type" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "businesses" ALTER COLUMN "id_type" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "businesses" ALTER COLUMN "id_number" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "businesses" ALTER COLUMN "id_country" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "businesses" ALTER COLUMN "id_level" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "businesses" ALTER COLUMN "dof" DROP NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "businesses" ALTER COLUMN "dof" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "businesses" ALTER COLUMN "id_level" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "businesses" ALTER COLUMN "id_country" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "businesses" ALTER COLUMN "id_number" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "businesses" ALTER COLUMN "id_type" SET DEFAULT 'ein'`);
        await queryRunner.query(`ALTER TABLE "businesses" ALTER COLUMN "id_type" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "businesses" ALTER COLUMN "address" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "businesses" ALTER COLUMN "industry" SET DEFAULT 'restaurants'`);
        await queryRunner.query(`ALTER TABLE "businesses" ALTER COLUMN "industry" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "businesses" ALTER COLUMN "business_type" SET DEFAULT 'soleProprietor'`);
        await queryRunner.query(`ALTER TABLE "businesses" ALTER COLUMN "business_type" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "businesses" ALTER COLUMN "name" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "businesses" DROP COLUMN "registration_status"`);
        await queryRunner.query(`DROP TYPE "public"."businesses_registration_status_enum"`);
        await queryRunner.query(`ALTER TABLE "businesses" DROP COLUMN "proof_of_address_doc"`);
        await queryRunner.query(`ALTER TABLE "businesses" DROP COLUMN "business_registration_doc"`);
        await queryRunner.query(`ALTER TABLE "businesses" ADD "id_upload" character varying NOT NULL`);
    }

}
