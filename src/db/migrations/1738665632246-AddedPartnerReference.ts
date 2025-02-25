import { MigrationInterface, QueryRunner } from "typeorm";

export class AddedPartnerReference1738665632246 implements MigrationInterface {
    name = 'AddedPartnerReference1738665632246'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."partner_references_entity_type_enum" AS ENUM('user', 'business')`);
        await queryRunner.query(`CREATE TYPE "public"."partner_references_partner_name_enum" AS ENUM('graph')`);
        await queryRunner.query(`CREATE TABLE "partner_references" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "entity_id" character varying NOT NULL, "entity_type" "public"."partner_references_entity_type_enum" NOT NULL, "partner_name" "public"."partner_references_partner_name_enum" NOT NULL, "partner_entity_id" character varying NOT NULL, "metadata" jsonb, "verification_status" character varying, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_773d116c24fd3f407e0bfda7432" PRIMARY KEY ("id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "partner_references"`);
        await queryRunner.query(`DROP TYPE "public"."partner_references_partner_name_enum"`);
        await queryRunner.query(`DROP TYPE "public"."partner_references_entity_type_enum"`);
    }

}
