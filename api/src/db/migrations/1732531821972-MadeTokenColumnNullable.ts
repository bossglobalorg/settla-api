import { MigrationInterface, QueryRunner } from "typeorm";

export class MadeTokenColumnNullable1732531821972 implements MigrationInterface {
    name = 'MadeTokenColumnNullable1732531821972'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "users"
            ALTER COLUMN "token" DROP NOT NULL
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "users"
            ALTER COLUMN "token"
            SET NOT NULL
        `);
    }

}
