import { MigrationInterface, QueryRunner } from "typeorm";

export class OptimizeBankAccountEntity1742570169958 implements MigrationInterface {
    name = 'OptimizeBankAccountEntity1742570169958'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "bank_accounts" DROP COLUMN "personId"`);
        await queryRunner.query(`ALTER TABLE "bank_accounts" ADD "holderId" character varying`);
        await queryRunner.query(`ALTER TABLE "bank_accounts" DROP COLUMN "userId"`);
        await queryRunner.query(`ALTER TABLE "bank_accounts" ADD "userId" uuid`);
        await queryRunner.query(`ALTER TABLE "bank_accounts" ADD CONSTRAINT "FK_45ef3ca170943e2c70e8073a7c5" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "bank_accounts" DROP CONSTRAINT "FK_45ef3ca170943e2c70e8073a7c5"`);
        await queryRunner.query(`ALTER TABLE "bank_accounts" DROP COLUMN "userId"`);
        await queryRunner.query(`ALTER TABLE "bank_accounts" ADD "userId" character varying`);
        await queryRunner.query(`ALTER TABLE "bank_accounts" DROP COLUMN "holderId"`);
        await queryRunner.query(`ALTER TABLE "bank_accounts" ADD "personId" character varying`);
    }

}
