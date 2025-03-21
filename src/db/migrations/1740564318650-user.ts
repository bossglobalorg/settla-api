import { MigrationInterface, QueryRunner } from "typeorm";

export class User1740564318650 implements MigrationInterface {
    name = 'User1740564318650'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TYPE "public"."users_id_type_enum"
            RENAME TO "users_id_type_enum_old"
        `);
        await queryRunner.query(`
            CREATE TYPE "public"."users_id_type_enum" AS ENUM(
                'passport',
                'national_id',
                'drivers_license',
                'nin'
            )
        `);
        await queryRunner.query(`
            ALTER TABLE "users"
            ALTER COLUMN "id_type" TYPE "public"."users_id_type_enum" USING "id_type"::"text"::"public"."users_id_type_enum"
        `);
        await queryRunner.query(`
            DROP TYPE "public"."users_id_type_enum_old"
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            CREATE TYPE "public"."users_id_type_enum_old" AS ENUM('passport', 'national_id', 'drivers_license')
        `);
        await queryRunner.query(`
            ALTER TABLE "users"
            ALTER COLUMN "id_type" TYPE "public"."users_id_type_enum_old" USING "id_type"::"text"::"public"."users_id_type_enum_old"
        `);
        await queryRunner.query(`
            DROP TYPE "public"."users_id_type_enum"
        `);
        await queryRunner.query(`
            ALTER TYPE "public"."users_id_type_enum_old"
            RENAME TO "users_id_type_enum"
        `);
    }

}
