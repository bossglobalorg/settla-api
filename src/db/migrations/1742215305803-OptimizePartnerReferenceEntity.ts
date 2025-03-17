import { MigrationInterface, QueryRunner } from 'typeorm'

export class OptimizePartnerReferenceEntity1742215305803 implements MigrationInterface {
  name = 'OptimizePartnerReferenceEntity1742215305803'

  public async up(queryRunner: QueryRunner): Promise<void> {
    // 1. Drop the foreign key constraint
    await queryRunner.query(
      `ALTER TABLE "partner_references" DROP CONSTRAINT "FK_db3215137229c9753018f69a5fc"`,
    )

    // 2. Add a temporary column that allows NULL values
    await queryRunner.query(
      `ALTER TABLE "partner_references" ADD "temp_entity_id" character varying`,
    )

    // 3. Copy data from the original column to the temporary column
    await queryRunner.query(
      `UPDATE "partner_references" SET "temp_entity_id" = "entity_id"::varchar WHERE "entity_id" IS NOT NULL`,
    )

    // 4. Set a default UUID for NULL values
    await queryRunner.query(
      `UPDATE "partner_references" SET "temp_entity_id" = '00000000-0000-0000-0000-000000000000' WHERE "entity_id" IS NULL`,
    )

    // 5. Drop the original column
    await queryRunner.query(`ALTER TABLE "partner_references" DROP COLUMN "entity_id"`)

    // 6. Rename the temporary column to the original name
    await queryRunner.query(
      `ALTER TABLE "partner_references" RENAME COLUMN "temp_entity_id" TO "entity_id"`,
    )

    // 7. Set NOT NULL constraint now that we have data in all rows
    await queryRunner.query(
      `ALTER TABLE "partner_references" ALTER COLUMN "entity_id" SET NOT NULL`,
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // 1. Add a temporary UUID column that allows NULL
    await queryRunner.query(`ALTER TABLE "partner_references" ADD "temp_entity_id" uuid`)

    // 2. Try to convert the values back to UUID format where possible
    // This assumes the values were originally valid UUIDs
    await queryRunner.query(`
            UPDATE "partner_references" 
            SET "temp_entity_id" = "entity_id"::uuid 
            WHERE "entity_id" ~ '^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$'
        `)

    // 3. Drop the character varying column
    await queryRunner.query(`ALTER TABLE "partner_references" DROP COLUMN "entity_id"`)

    // 4. Rename the temp column back
    await queryRunner.query(
      `ALTER TABLE "partner_references" RENAME COLUMN "temp_entity_id" TO "entity_id"`,
    )

    // 5. Set NOT NULL constraint
    await queryRunner.query(
      `ALTER TABLE "partner_references" ALTER COLUMN "entity_id" SET NOT NULL`,
    )

    // 6. Add back the foreign key constraint
    await queryRunner.query(
      `ALTER TABLE "partner_references" ADD CONSTRAINT "FK_db3215137229c9753018f69a5fc" FOREIGN KEY ("entity_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    )
  }
}
