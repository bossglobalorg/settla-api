import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateKybKycDocuments1746715026685 implements MigrationInterface {
    name = 'UpdateKybKycDocuments1746715026685'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "kyc_documents" ADD "issue_date" TIMESTAMP`);
        await queryRunner.query(`ALTER TABLE "kyc_documents" ADD "expiry_date" TIMESTAMP`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "kyc_documents" DROP COLUMN "expiry_date"`);
        await queryRunner.query(`ALTER TABLE "kyc_documents" DROP COLUMN "issue_date"`);
    }

}
