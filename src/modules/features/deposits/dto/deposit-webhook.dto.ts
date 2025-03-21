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
  network: string
  chain_hash: string
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

export class DepositWebhookDataDto {
  account_id: string
  amount: number
  balance_after: number
  balance_before: number
  wallet_account: WalletAccountDto
  created_at: string
  currency: string
  deposit: DepositDetailsDto
  deposit_id: string
  description: string
  id: string
  kind: string
  linked_transaction_id: string | null
  payout_id: string | null
  status: string
  type: string
  updated_at: string
}

export class DepositWebhookDto {
  data: DepositWebhookDataDto
  entity: string
  event_type: string
}
