import { MigrationInterface, QueryRunner } from "typeorm";

export class AddEmailVerificationColumnsts1732679065058 implements MigrationInterface {
    name = 'AddEmailVerificationColumns.ts1732679065058'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "users"
            ADD "email_verified" boolean NOT NULL DEFAULT false
        `);
        await queryRunner.query(`
            ALTER TABLE "users"
            ADD "email_verification_token" character varying
        `);
        await queryRunner.query(`
            ALTER TABLE "users"
            ADD "email_verification_token_expires_at" TIMESTAMP
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "users" DROP COLUMN "email_verification_token_expires_at"
        `);
        await queryRunner.query(`
            ALTER TABLE "users" DROP COLUMN "email_verification_token"
        `);
        await queryRunner.query(`
            ALTER TABLE "users" DROP COLUMN "email_verified"
        `);
    }

}
