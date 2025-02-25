import { MigrationInterface, QueryRunner } from "typeorm";

export class AddKycColumns1737970307039 implements MigrationInterface {
    name = 'AddKycColumns1737970307039'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."businesses_business_type_enum" AS ENUM('soleProprietor', 'singleMemberLLC', 'limitedLiabilityCompany')`);
        await queryRunner.query(`CREATE TYPE "public"."businesses_industry_enum" AS ENUM('restaurants', 'hotelMotel', 'otherFoodServices')`);
        await queryRunner.query(`CREATE TYPE "public"."businesses_id_type_enum" AS ENUM('ein', 'cac')`);
        await queryRunner.query(`CREATE TYPE "public"."businesses_id_country_enum" AS ENUM('US', 'NG')`);
        await queryRunner.query(`CREATE TYPE "public"."businesses_id_level_enum" AS ENUM('primary', 'secondary')`);
        await queryRunner.query(`CREATE TABLE "businesses" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "date_created" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "date_updated" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "owner_id" character varying NOT NULL, "name" character varying NOT NULL, "business_type" "public"."businesses_business_type_enum" NOT NULL DEFAULT 'soleProprietor', "industry" "public"."businesses_industry_enum" NOT NULL DEFAULT 'restaurants', "id_type" "public"."businesses_id_type_enum" NOT NULL DEFAULT 'ein', "id_number" character varying NOT NULL, "id_country" "public"."businesses_id_country_enum" NOT NULL, "id_upload" character varying NOT NULL, "id_level" "public"."businesses_id_level_enum" NOT NULL, "dof" date NOT NULL, "contact_phone" character varying, "contact_email" character varying, "address" jsonb NOT NULL, "kyb_status" character varying, "kyb_response" jsonb, CONSTRAINT "PK_bc1bf63498dd2368ce3dc8686e8" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "users" ADD "kyc_status" character varying`);
        await queryRunner.query(`ALTER TABLE "users" ADD "kyc_response" jsonb`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "kyc_response"`);
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "kyc_status"`);
        await queryRunner.query(`DROP TABLE "businesses"`);
        await queryRunner.query(`DROP TYPE "public"."businesses_id_level_enum"`);
        await queryRunner.query(`DROP TYPE "public"."businesses_id_country_enum"`);
        await queryRunner.query(`DROP TYPE "public"."businesses_id_type_enum"`);
        await queryRunner.query(`DROP TYPE "public"."businesses_industry_enum"`);
        await queryRunner.query(`DROP TYPE "public"."businesses_business_type_enum"`);
    }

}
