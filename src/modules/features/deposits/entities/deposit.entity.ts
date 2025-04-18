import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm'

@Entity('deposits')
export class Deposit {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column({ name: 'deposit_id', nullable: true, type: 'varchar' })
  depositId: string

  @Column({ name: 'transaction_id', nullable: true, type: 'varchar' })
  transactionId: string

  @Column({ name: 'account_id' })
  accountId: string

  @Column({ name: 'account_type' })
  accountType: string

  @Column({ name: 'object_type', nullable: true, type: 'varchar' })
  objectType: string

  @Column({ name: 'organisation_id' })
  organisationId: string

  @Column({ type: 'decimal', precision: 20, scale: 2, name: 'amount' })
  amount: number

  @Column({ type: 'decimal', precision: 20, scale: 2, name: 'balance_before' })
  balanceBefore: number

  @Column({ type: 'decimal', precision: 20, scale: 2, name: 'balance_after' })
  balanceAfter: number

  @Column({ name: 'currency' })
  currency: string

  @Column({ name: 'currency_settlement', nullable: true, type: 'varchar' })
  currencySettlement: string | null

  @Column({ name: 'description', nullable: true, type: 'varchar' })
  description: string | null

  @Column({ name: 'status' })
  status: string

  @Column({ name: 'type' })
  type: string

  @Column({ name: 'kind' })
  kind: string

  @Column({ name: 'custom_reference', nullable: true, type: 'varchar' })
  customReference: string | null

  @Column({ name: 'linked_transaction_id', nullable: true, type: 'varchar' })
  linkedTransactionId: string | null

  @Column({ name: 'payout_id', nullable: true, type: 'varchar' })
  payoutId: string | null

  @Column({ name: 'charge_id', nullable: true, type: 'varchar' })
  chargeId: string | null

  @Column({ name: 'conversion_id', nullable: true, type: 'varchar' })
  conversionId: string | null

  @Column({ name: 'card_id', nullable: true, type: 'varchar' })
  cardId: string | null

  // Bank Account details
  @Column({ name: 'bank_account_id', nullable: true, type: 'varchar' })
  bankAccountId: string | null

  @Column({ name: 'bank_account_name', nullable: true, type: 'varchar' })
  bankAccountName: string | null

  @Column({ name: 'bank_account_number', nullable: true, type: 'varchar' })
  bankAccountNumber: string | null

  @Column({ name: 'bank_name', nullable: true, type: 'varchar' })
  bankName: string | null

  @Column({ name: 'bank_code', nullable: true, type: 'varchar' })
  bankCode: string | null

  @Column({ name: 'bank_type', nullable: true, type: 'varchar' })
  bankType: string | null

  @Column({ name: 'bank_routing_number', nullable: true, type: 'varchar' })
  bankRoutingNumber: string | null

  @Column({ name: 'bank_swift_code', nullable: true, type: 'varchar' })
  bankSwiftCode: string | null

  @Column({ name: 'bank_iban', nullable: true, type: 'varchar' })
  bankIban: string | null

  @Column({ type: 'decimal', precision: 20, scale: 2, name: 'bank_balance', nullable: true })
  bankBalance: number | null

  @Column({ name: 'bank_currency', nullable: true, type: 'varchar' })
  bankCurrency: string | null

  @Column({ name: 'bank_currency_settlement', nullable: true, type: 'varchar' })
  bankCurrencySettlement: string | null

  @Column({ type: 'decimal', precision: 20, scale: 2, name: 'bank_credit_pending', nullable: true })
  bankCreditPending: number | null

  @Column({ type: 'decimal', precision: 20, scale: 2, name: 'bank_debit_pending', nullable: true })
  bankDebitPending: number | null

  @Column({ name: 'bank_status', nullable: true, type: 'varchar' })
  bankStatus: string | null

  @Column({ name: 'bank_holder_id', nullable: true, type: 'varchar' })
  bankHolderId: string | null

  @Column({ name: 'bank_holder_type', nullable: true, type: 'varchar' })
  bankHolderType: string | null

  // Bank Address
  @Column({ name: 'bank_address_line1', nullable: true, type: 'varchar' })
  bankAddressLine1: string | null

  @Column({ name: 'bank_address_line2', nullable: true, type: 'varchar' })
  bankAddressLine2: string | null

  @Column({ name: 'bank_address_city', nullable: true, type: 'varchar' })
  bankAddressCity: string | null

  @Column({ name: 'bank_address_state', nullable: true, type: 'varchar' })
  bankAddressState: string | null

  @Column({ name: 'bank_address_country', nullable: true, type: 'varchar' })
  bankAddressCountry: string | null

  @Column({ name: 'bank_address_postal_code', nullable: true, type: 'varchar' })
  bankAddressPostalCode: string | null

  // Beneficiary Address
  @Column({ name: 'beneficiary_address_line1', nullable: true, type: 'varchar' })
  beneficiaryAddressLine1: string | null

  @Column({ name: 'beneficiary_address_line2', nullable: true, type: 'varchar' })
  beneficiaryAddressLine2: string | null

  @Column({ name: 'beneficiary_address_city', nullable: true, type: 'varchar' })
  beneficiaryAddressCity: string | null

  @Column({ name: 'beneficiary_address_state', nullable: true, type: 'varchar' })
  beneficiaryAddressState: string | null

  @Column({ name: 'beneficiary_address_country', nullable: true, type: 'varchar' })
  beneficiaryAddressCountry: string | null

  @Column({ name: 'beneficiary_address_postal_code', nullable: true, type: 'varchar' })
  beneficiaryAddressPostalCode: string | null

  // Wallet account details
  @Column({ name: 'wallet_account_id', nullable: true, type: 'varchar' })
  walletAccountId: string | null

  @Column({ name: 'wallet_currency', nullable: true, type: 'varchar' })
  walletCurrency: string | null

  @Column({ type: 'decimal', precision: 20, scale: 2, name: 'wallet_balance', nullable: true })
  walletBalance: number | null

  @Column({ name: 'wallet_kind', nullable: true, type: 'varchar' })
  walletKind: string | null

  @Column({ name: 'wallet_status', nullable: true, type: 'varchar' })
  walletStatus: string | null

  // Deposit details
  @Column({ name: 'deposit_object_type', nullable: true, type: 'varchar' })
  depositObjectType: string | null

  @Column({ name: 'deposit_account_type', nullable: true, type: 'varchar' })
  depositAccountType: string | null

  @Column({ name: 'deposit_type', nullable: true, type: 'varchar' })
  depositType: string | null

  @Column({ name: 'deposit_confirmations', nullable: true, type: 'int' })
  depositConfirmations: number | null

  @Column({
    name: 'deposit_amount_source',
    nullable: true,
    type: 'decimal',
    precision: 20,
    scale: 2,
  })
  depositAmountSource: number | null

  @Column({
    name: 'deposit_amount_settled',
    nullable: true,
    type: 'decimal',
    precision: 20,
    scale: 2,
  })
  depositAmountSettled: number | null

  @Column({ name: 'deposit_fee', nullable: true, type: 'decimal', precision: 20, scale: 2 })
  depositFee: number | null

  @Column({ name: 'deposit_settlement_type', nullable: true, type: 'varchar' })
  depositSettlementType: string | null

  @Column({
    name: 'deposit_settlement_rate',
    nullable: true,
    type: 'decimal',
    precision: 10,
    scale: 6,
  })
  depositSettlementRate: number | null

  @Column({ name: 'deposit_currency_source', nullable: true, type: 'varchar' })
  depositCurrencySource: string | null

  // Payer details
  @Column({ name: 'payer_account_name', nullable: true, type: 'varchar' })
  payerAccountName: string | null

  @Column({ name: 'payer_account_number', nullable: true, type: 'varchar' })
  payerAccountNumber: string | null

  @Column({ name: 'payer_bank_code', nullable: true, type: 'varchar' })
  payerBankCode: string | null

  @Column({ name: 'payer_bank_name', nullable: true, type: 'varchar' })
  payerBankName: string | null

  @Column({ name: 'payer_routing_number', nullable: true, type: 'varchar' })
  payerRoutingNumber: string | null

  @Column({ name: 'payer_routing_type', nullable: true, type: 'varchar' })
  payerRoutingType: string | null

  @Column({ name: 'payer_routing_rail', nullable: true, type: 'varchar' })
  payerRoutingRail: string | null

  @Column({ name: 'payer_trace_number', nullable: true, type: 'varchar' })
  payerTraceNumber: string | null

  @Column({ name: 'payer_session_id', nullable: true, type: 'varchar' })
  payerSessionId: string | null

  @Column({ name: 'payer_network', nullable: true, type: 'varchar' })
  depositNetwork: string | null

  @Column({ name: 'payer_chain_hash', nullable: true, type: 'varchar' })
  depositChainHash: string | null

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date

  @Column({ name: 'transaction_created_at', type: 'timestamp', nullable: true })
  transactionCreatedAt: Date | null

  @Column({ name: 'transaction_updated_at', type: 'timestamp', nullable: true })
  transactionUpdatedAt: Date | null

  @Column({ name: 'deposit_created_at', type: 'timestamp', nullable: true })
  depositCreatedAt: Date | null

  @Column({ name: 'deposit_updated_at', type: 'timestamp', nullable: true })
  depositUpdatedAt: Date | null

  @Column({ name: 'bank_created_at', type: 'timestamp', nullable: true })
  bankCreatedAt: Date | null

  @Column({ name: 'bank_updated_at', type: 'timestamp', nullable: true })
  bankUpdatedAt: Date | null
}
