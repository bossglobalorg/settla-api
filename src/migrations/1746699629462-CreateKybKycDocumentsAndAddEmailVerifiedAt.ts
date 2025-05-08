import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateKybKycDocumentsAndAddEmailVerifiedAt1746699629462 implements MigrationInterface {
    name = 'CreateKybKycDocumentsAndAddEmailVerifiedAt1746699629462'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."kyc_documents_document_type_enum" AS ENUM('passport', 'national_id', 'drivers_license', 'proof_of_address', 'proof_of_funds', 'voters_card', 'residence_permit', 'utility_bill', 'bank_statement', 'tenancy_agreement', 'proof_of_income', 'tax_return', 'payslip', 'selfie', 'video_verification', 'signature', 'other')`);
        await queryRunner.query(`CREATE TYPE "public"."kyc_documents_status_enum" AS ENUM('pending', 'approved', 'rejected')`);
        await queryRunner.query(`CREATE TABLE "kyc_documents" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "date_created" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "date_updated" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "user_id" uuid NOT NULL, "document_type" "public"."kyc_documents_document_type_enum" NOT NULL, "document_url" character varying NOT NULL, "uploaded_at" TIMESTAMP NOT NULL DEFAULT now(), "verified_at" TIMESTAMP, "status" "public"."kyc_documents_status_enum" NOT NULL DEFAULT 'pending', CONSTRAINT "PK_02e49877f1578e6285f84e57ab6" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."kyb_documents_document_type_enum" AS ENUM('tax_id', 'license', 'certificate_of_incorporation', 'cac', 'ein', 'business_registration', 'business_license', 'operating_license', 'trade_license', 'tin', 'vat', 'regulatory_approval', 'industry_certification', 'financial_statement', 'bank_statement', 'aml_policy', 'kyc_policy', 'proof_of_address', 'memorandum_of_association', 'articles_of_association', 'board_resolution', 'shareholding_structure')`);
        await queryRunner.query(`CREATE TYPE "public"."kyb_documents_status_enum" AS ENUM('pending', 'approved', 'rejected')`);
        await queryRunner.query(`CREATE TABLE "kyb_documents" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "date_created" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "date_updated" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "business_id" uuid NOT NULL, "user_id" uuid NOT NULL, "document_type" "public"."kyb_documents_document_type_enum" NOT NULL, "document_url" character varying NOT NULL, "uploaded_at" TIMESTAMP NOT NULL DEFAULT now(), "verified_at" TIMESTAMP, "status" "public"."kyb_documents_status_enum" NOT NULL DEFAULT 'pending', CONSTRAINT "PK_f0a7bf221c622cf80273e5dcaef" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "users" ADD "email_verified_at" TIMESTAMP`);
        await queryRunner.query(`ALTER TABLE "bank_accounts" DROP COLUMN "businessId"`);
        await queryRunner.query(`ALTER TABLE "bank_accounts" ADD "businessId" uuid`);
        await queryRunner.query(`ALTER TABLE "bank_accounts" ADD CONSTRAINT "FK_94e40b35f350a08e5bfcddd3a00" FOREIGN KEY ("businessId") REFERENCES "businesses"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "kyc_documents" ADD CONSTRAINT "FK_83d1e7b68c12df09ba0e272c1a5" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "kyb_documents" ADD CONSTRAINT "FK_bf1ef96c2f0593cc23524b394ca" FOREIGN KEY ("business_id") REFERENCES "businesses"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "kyb_documents" ADD CONSTRAINT "FK_3e88a84609efe05ef9644d19ca0" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "kyb_documents" DROP CONSTRAINT "FK_3e88a84609efe05ef9644d19ca0"`);
        await queryRunner.query(`ALTER TABLE "kyb_documents" DROP CONSTRAINT "FK_bf1ef96c2f0593cc23524b394ca"`);
        await queryRunner.query(`ALTER TABLE "kyc_documents" DROP CONSTRAINT "FK_83d1e7b68c12df09ba0e272c1a5"`);
        await queryRunner.query(`ALTER TABLE "bank_accounts" DROP CONSTRAINT "FK_94e40b35f350a08e5bfcddd3a00"`);
        await queryRunner.query(`ALTER TABLE "bank_accounts" DROP COLUMN "businessId"`);
        await queryRunner.query(`ALTER TABLE "bank_accounts" ADD "businessId" character varying`);
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "email_verified_at"`);
        await queryRunner.query(`DROP TABLE "kyb_documents"`);
        await queryRunner.query(`DROP TYPE "public"."kyb_documents_status_enum"`);
        await queryRunner.query(`DROP TYPE "public"."kyb_documents_document_type_enum"`);
        await queryRunner.query(`DROP TABLE "kyc_documents"`);
        await queryRunner.query(`DROP TYPE "public"."kyc_documents_status_enum"`);
        await queryRunner.query(`DROP TYPE "public"."kyc_documents_document_type_enum"`);
    }

}
