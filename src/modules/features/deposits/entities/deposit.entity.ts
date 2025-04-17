import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm'

@Entity('deposits')
export class Deposit {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column({ name: 'deposit_id', nullable: true })
  depositId: string

  @Column({ name: 'transaction_id', nullable: true })
  transactionId: string

  @Column({ name: 'account_id' })
  accountId: string

  @Column({ name: 'account_type' })
  accountType: string

  @Column({ name: 'object_type', nullable: true })
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

  @Column({ name: 'currency_settlement', nullable: true })
  currencySettlement: string | null

  @Column({ name: 'description', nullable: true })
  description: string | null

  @Column({ name: 'status' })
  status: string

  @Column({ name: 'type' })
  type: string

  @Column({ name: 'kind' })
  kind: string

  @Column({ name: 'custom_reference', nullable: true })
  customReference: string | null

  @Column({ name: 'linked_transaction_id', nullable: true })
  linkedTransactionId: string | null

  @Column({ name: 'payout_id', nullable: true })
  payoutId: string | null

  @Column({ name: 'charge_id', nullable: true })
  chargeId: string | null

  @Column({ name: 'conversion_id', nullable: true })
  conversionId: string | null

  @Column({ name: 'card_id', nullable: true })
  cardId: string | null

  // Bank Account details
  @Column({ name: 'bank_account_id', nullable: true })
  bankAccountId: string | null

  @Column({ name: 'bank_account_name', nullable: true })
  bankAccountName: string | null

  @Column({ name: 'bank_account_number', nullable: true })
  bankAccountNumber: string | null

  @Column({ name: 'bank_name', nullable: true })
  bankName: string | null

  @Column({ name: 'bank_code', nullable: true })
  bankCode: string | null

  @Column({ name: 'bank_type', nullable: true })
  bankType: string | null

  @Column({ name: 'bank_routing_number', nullable: true })
  bankRoutingNumber: string | null

  @Column({ name: 'bank_swift_code', nullable: true })
  bankSwiftCode: string | null

  @Column({ name: 'bank_iban', nullable: true })
  bankIban: string | null

  @Column({ type: 'decimal', precision: 20, scale: 2, name: 'bank_balance', nullable: true })
  bankBalance: number | null

  @Column({ name: 'bank_currency', nullable: true })
  bankCurrency: string | null

  @Column({ name: 'bank_currency_settlement', nullable: true })
  bankCurrencySettlement: string | null

  @Column({ type: 'decimal', precision: 20, scale: 2, name: 'bank_credit_pending', nullable: true })
  bankCreditPending: number | null

  @Column({ type: 'decimal', precision: 20, scale: 2, name: 'bank_debit_pending', nullable: true })
  bankDebitPending: number | null

  @Column({ name: 'bank_status', nullable: true })
  bankStatus: string | null

  @Column({ name: 'bank_holder_id', nullable: true })
  bankHolderId: string | null

  @Column({ name: 'bank_holder_type', nullable: true })
  bankHolderType: string | null

  // Bank Address
  @Column({ name: 'bank_address_line1', nullable: true })
  bankAddressLine1: string | null

  @Column({ name: 'bank_address_line2', nullable: true })
  bankAddressLine2: string | null

  @Column({ name: 'bank_address_city', nullable: true })
  bankAddressCity: string | null

  @Column({ name: 'bank_address_state', nullable: true })
  bankAddressState: string | null

  @Column({ name: 'bank_address_country', nullable: true })
  bankAddressCountry: string | null

  @Column({ name: 'bank_address_postal_code', nullable: true })
  bankAddressPostalCode: string | null

  // Beneficiary Address
  @Column({ name: 'beneficiary_address_line1', nullable: true })
  beneficiaryAddressLine1: string | null

  @Column({ name: 'beneficiary_address_line2', nullable: true })
  beneficiaryAddressLine2: string | null

  @Column({ name: 'beneficiary_address_city', nullable: true })
  beneficiaryAddressCity: string | null

  @Column({ name: 'beneficiary_address_state', nullable: true })
  beneficiaryAddressState: string | null

  @Column({ name: 'beneficiary_address_country', nullable: true })
  beneficiaryAddressCountry: string | null

  @Column({ name: 'beneficiary_address_postal_code', nullable: true })
  beneficiaryAddressPostalCode: string | null

  // Wallet account details
  @Column({ name: 'wallet_account_id', nullable: true })
  walletAccountId: string | null

  @Column({ name: 'wallet_currency', nullable: true })
  walletCurrency: string | null

  @Column({ type: 'decimal', precision: 20, scale: 2, name: 'wallet_balance', nullable: true })
  walletBalance: number | null

  @Column({ name: 'wallet_kind', nullable: true })
  walletKind: string | null

  @Column({ name: 'wallet_status', nullable: true })
  walletStatus: string | null

  // Deposit details
  @Column({ name: 'deposit_object_type', nullable: true })
  depositObjectType: string | null

  @Column({ name: 'deposit_account_type', nullable: true })
  depositAccountType: string | null

  @Column({ name: 'deposit_type', nullable: true })
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

  @Column({ name: 'deposit_settlement_type', nullable: true })
  depositSettlementType: string | null

  @Column({
    name: 'deposit_settlement_rate',
    nullable: true,
    type: 'decimal',
    precision: 10,
    scale: 6,
  })
  depositSettlementRate: number | null

  @Column({ name: 'deposit_currency_source', nullable: true })
  depositCurrencySource: string | null

  // Payer details
  @Column({ name: 'payer_account_name', nullable: true })
  payerAccountName: string | null

  @Column({ name: 'payer_account_number', nullable: true })
  payerAccountNumber: string | null

  @Column({ name: 'payer_bank_code', nullable: true })
  payerBankCode: string | null

  @Column({ name: 'payer_bank_name', nullable: true })
  payerBankName: string | null

  @Column({ name: 'payer_routing_number', nullable: true })
  payerRoutingNumber: string | null

  @Column({ name: 'payer_routing_type', nullable: true })
  payerRoutingType: string | null

  @Column({ name: 'payer_routing_rail', nullable: true })
  payerRoutingRail: string | null

  @Column({ name: 'payer_trace_number', nullable: true })
  payerTraceNumber: string | null

  @Column({ name: 'payer_session_id', nullable: true })
  payerSessionId: string | null

  @Column({ name: 'payer_network', nullable: true })
  depositNetwork: string | null

  @Column({ name: 'payer_chain_hash', nullable: true })
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
