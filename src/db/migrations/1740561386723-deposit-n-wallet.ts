import { MigrationInterface, QueryRunner } from "typeorm";

export class DepositNWallet1740561386723 implements MigrationInterface {
    name = 'DepositNWallet1740561386723'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            CREATE TABLE "wallet_accounts" (
                "id" character varying NOT NULL,
                "currency" character varying NOT NULL,
                "balance" numeric(20, 2) NOT NULL DEFAULT '0',
                "blockExpiry" TIMESTAMP,
                "kind" character varying NOT NULL,
                "status" character varying NOT NULL,
                "isDeleted" boolean NOT NULL DEFAULT false,
                "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
                "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
                "userId" character varying NOT NULL,
                CONSTRAINT "PK_7d29a782bf4203c2ed2b613353d" PRIMARY KEY ("id")
            )
        `);
        await queryRunner.query(`
            CREATE TABLE "deposits" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "depositId" character varying,
                "transactionId" character varying,
                "accountId" character varying NOT NULL,
                "amount" numeric(20, 2) NOT NULL,
                "balanceBefore" numeric(20, 2) NOT NULL,
                "balanceAfter" numeric(20, 2) NOT NULL,
                "currency" character varying NOT NULL,
                "description" character varying,
                "status" character varying NOT NULL,
                "type" character varying NOT NULL,
                "kind" character varying NOT NULL,
                "linkedTransactionId" character varying,
                "payoutId" character varying,
                "walletAccountId" character varying NOT NULL,
                "walletCurrency" character varying NOT NULL,
                "walletBalance" numeric(20, 2) NOT NULL,
                "walletKind" character varying,
                "walletStatus" character varying NOT NULL,
                "depositObjectType" character varying,
                "depositAccountType" character varying,
                "depositType" character varying,
                "depositConfirmations" integer,
                "depositAmountSource" numeric(20, 2),
                "depositAmountSettled" numeric(20, 2),
                "depositFee" numeric(20, 2),
                "depositSettlementType" character varying,
                "depositSettlementRate" numeric(10, 6),
                "depositCurrencySource" character varying,
                "depositNetwork" character varying,
                "depositChainHash" character varying,
                "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
                "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
                "transactionCreatedAt" TIMESTAMP,
                "transactionUpdatedAt" TIMESTAMP,
                "depositCreatedAt" TIMESTAMP,
                "depositUpdatedAt" TIMESTAMP,
                CONSTRAINT "PK_f49ba0cd446eaf7abb4953385d9" PRIMARY KEY ("id")
            )
        `);
        await queryRunner.query(`
            ALTER TABLE "businesses" DROP COLUMN "owner_id"
        `);
        await queryRunner.query(`
            ALTER TABLE "businesses"
            ADD "owner_id" uuid NOT NULL
        `);
        await queryRunner.query(`
            ALTER TABLE "partner_references" DROP COLUMN "entity_id"
        `);
        await queryRunner.query(`
            ALTER TABLE "partner_references"
            ADD "entity_id" uuid NOT NULL
        `);
        await queryRunner.query(`
            ALTER TABLE "businesses"
            ADD CONSTRAINT "FK_8881b96819252080592fe1592ea" FOREIGN KEY ("owner_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
        await queryRunner.query(`
            ALTER TABLE "partner_references"
            ADD CONSTRAINT "FK_db3215137229c9753018f69a5fc" FOREIGN KEY ("entity_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "partner_references" DROP CONSTRAINT "FK_db3215137229c9753018f69a5fc"
        `);
        await queryRunner.query(`
            ALTER TABLE "businesses" DROP CONSTRAINT "FK_8881b96819252080592fe1592ea"
        `);
        await queryRunner.query(`
            ALTER TABLE "partner_references" DROP COLUMN "entity_id"
        `);
        await queryRunner.query(`
            ALTER TABLE "partner_references"
            ADD "entity_id" character varying NOT NULL
        `);
        await queryRunner.query(`
            ALTER TABLE "businesses" DROP COLUMN "owner_id"
        `);
        await queryRunner.query(`
            ALTER TABLE "businesses"
            ADD "owner_id" character varying NOT NULL
        `);
        await queryRunner.query(`
            DROP TABLE "deposits"
        `);
        await queryRunner.query(`
            DROP TABLE "wallet_accounts"
        `);
    }

}
