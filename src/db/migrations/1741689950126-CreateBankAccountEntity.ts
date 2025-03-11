import { MigrationInterface, QueryRunner } from 'typeorm'

export class CreateBankAccountEntity1741689950126 implements MigrationInterface {
  name = 'CreateBankAccountEntity1741689950126'

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "bank_accounts" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "accountNumber" character varying NOT NULL, "accountName" character varying, "bankName" character varying NOT NULL, "bankCode" character varying NOT NULL, "currency" character varying NOT NULL, "branchCode" character varying, "swiftCode" character varying, "routingNumber" character varying, "iban" character varying, "status" character varying NOT NULL, "type" character varying NOT NULL, "whitelistEnabled" boolean NOT NULL DEFAULT false, "whitelist" json, "autosweepEnabled" boolean NOT NULL DEFAULT false, "masterAccountId" character varying, "businessId" character varying, "personId" character varying, "userId" character varying, "label" character varying NOT NULL, "isVerified" boolean NOT NULL DEFAULT false, "isPrimary" boolean NOT NULL DEFAULT false, "isDeleted" boolean NOT NULL DEFAULT false, "metadata" json, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_c872de764f2038224a013ff25ed" PRIMARY KEY ("id"))`,
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "bank_accounts"`)
  }
}
