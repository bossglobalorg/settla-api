import { MigrationInterface, QueryRunner } from "typeorm";

export class AddEmailVerificationColumnsts1732712856911 implements MigrationInterface {
    name = 'AddEmailVerificationColumns.ts1732712856911'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "users" DROP COLUMN "email_verification_token"
        `);
        await queryRunner.query(`
            ALTER TABLE "users" DROP COLUMN "email_verification_token_expires_at"
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "users"
            ADD "email_verification_token_expires_at" TIMESTAMP
        `);
        await queryRunner.query(`
            ALTER TABLE "users"
            ADD "email_verification_token" character varying
        `);
    }

}
