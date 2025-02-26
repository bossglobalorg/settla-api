import { MigrationInterface, QueryRunner } from "typeorm";

export class Business1740567275759 implements MigrationInterface {
    name = 'Business1740567275759'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "businesses"
            ADD "partner_entity_id" character varying NOT NULL
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "businesses" DROP COLUMN "partner_entity_id"
        `);
    }

}
