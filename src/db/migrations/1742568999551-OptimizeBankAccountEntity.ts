import { MigrationInterface, QueryRunner } from "typeorm";

export class OptimizeBankAccountEntity1742568999551 implements MigrationInterface {
    name = 'OptimizeBankAccountEntity1742568999551'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "bank_accounts" ALTER COLUMN "accountNumber" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "bank_accounts" ALTER COLUMN "bankName" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "bank_accounts" ALTER COLUMN "bankCode" DROP NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "bank_accounts" ALTER COLUMN "bankCode" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "bank_accounts" ALTER COLUMN "bankName" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "bank_accounts" ALTER COLUMN "accountNumber" SET NOT NULL`);
    }

}
