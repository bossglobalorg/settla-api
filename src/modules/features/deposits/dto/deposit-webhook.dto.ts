export class WalletAccountDto {
  id: string
  currency: string
  balance: number
  block_expiry: string | null
  kind: string
  status: string
  is_deleted: number
  created_at: string
  updated_at: string
}

export class PayerDto {
  account_name: string | null
  account_number: string | null
  bank_code: string | null
  bank_name: string | null
  chain_hash: string | null
  imad: string | null
  network: string | null
  routing_number: string | null
  routing_rail: string | null
  routing_type: string | null
  session_id: string | null
  trace_number: string | null
}

export class DepositDetailsDto {
  id: string
  object_type: string
  card_id: string | null
  account_id: string
  account_type: string
  source_account_id: string | null
  address_id: string | null
  type: string
  confirmations: number
  amount: number
  amount_source: number
  amount_settled: number
  fee: number
  settlement_type: string
  settlement_rate: number
  payer: PayerDto
  chain_hash: string | null
  currency: string
  currency_source: string
  status: string
  created_at: string
  updated_at: string
}

export class BeneficiaryAddressDto {
  city: string
  country: string
  line1: string
  line2: string | null
  postal_code: string
  state: string | null
}

export class MemoInformationDto {
  instruction: string | null
  is_managed: boolean
  line: string | null
  line_iti: string | null
  reference: string | null
}

export class BankAddressDto {
  city: string
  country: string
  line1: string
  line2: string
  postal_code: string
  state: string
}

export class DepositBankAccountDto {
  account_name: string
  account_number: string
  autosweep_enabled: boolean
  balance: number
  bank_address: BankAddressDto
  bank_code: string
  bank_name: string
  beneficiary_address: BeneficiaryAddressDto
  block_expiry: string | null
  check_number: string | null
  created_at: string
  credit_pending: number
  currency: string
  currency_settlement: string
  debit_pending: number
  holder_id: string
  holder_type: string | null
  iban: string | null
  id: string
  is_deleted: boolean
  kind: string
  label: string
  memo_information: MemoInformationDto
  routing_number: string | null
  status: string
  status_description: string | null
  swift_code: string | null
  type: string
  updated_at: string
  whitelist_enabled: boolean
}

export class DepositWebhookDataDto {
  account_id: string
  account_type: string
  amount: number
  balance_after: number
  balance_before: number
  bank_account: DepositBankAccountDto
  card_id: string | null
  charge_id: string | null
  conversion_id: string | null
  created_at: string
  currency: string
  currency_settlement: string
  custom_reference: string | null
  deposit: DepositDetailsDto
  deposit_id: string
  description: string
  id: string
  kind: string
  linked_transaction_id: string | null
  object_type: string
  organisation_id: string
  payout_id: string | null
  status: string
  type: string
  updated_at: string
  wallet_account: WalletAccountDto | null
}

export class DepositWebhookDto {
  data: DepositWebhookDataDto
  entity: string
  event_type: string
}
