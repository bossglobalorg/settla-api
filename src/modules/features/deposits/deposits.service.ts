import { Repository } from 'typeorm'

import { Injectable, Logger, NotFoundException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'

import { DepositWebhookDto } from './dto/deposit-webhook.dto'
import { Deposit } from './entities/deposit.entity'

@Injectable()
export class DepositsService {
  private readonly logger = new Logger(DepositsService.name)

  constructor(
    @InjectRepository(Deposit)
    private readonly depositRepository: Repository<Deposit>,
  ) {}

  async handleDepositWebhook(webhookData: DepositWebhookDto): Promise<void> {
    try {
      this.logger.log(`Processing deposit webhook: ${JSON.stringify(webhookData)}`)

      const { data } = webhookData

      // Check if this is a deposit event
      if (webhookData.event_type !== 'account.credit' || data.kind !== 'deposit') {
        this.logger.warn(`Ignoring non-deposit webhook event: ${webhookData.event_type}`)
        return
      }

      // Check if deposit already exists to avoid duplicates
      const existingDeposit = await this.depositRepository.findOne({
        where: { transactionId: data.id },
      })

      if (existingDeposit) {
        this.logger.warn(`Deposit with transaction ID ${data.id} already exists`)
        return
      }

      // Create new deposit entity
      const newDeposit = new Deposit()

      // Transaction data
      newDeposit.transactionId = data.id
      newDeposit.depositId = data.deposit_id
      newDeposit.accountId = data.account_id
      newDeposit.accountType = data.account_type
      newDeposit.objectType = data.object_type
      newDeposit.organisationId = data.organisation_id
      newDeposit.amount = data.amount
      newDeposit.balanceBefore = data.balance_before
      newDeposit.balanceAfter = data.balance_after
      newDeposit.currency = data.currency
      newDeposit.currencySettlement = data.currency_settlement
      newDeposit.description = data.description
      newDeposit.status = data.status
      newDeposit.type = data.type
      newDeposit.kind = data.kind
      newDeposit.customReference = data.custom_reference ?? null
      newDeposit.linkedTransactionId = data.linked_transaction_id ?? null
      newDeposit.payoutId = data.payout_id ?? null
      newDeposit.chargeId = data.charge_id ?? null
      newDeposit.conversionId = data.conversion_id ?? null
      newDeposit.cardId = data.card_id ?? null
      newDeposit.transactionCreatedAt = data.created_at ? new Date(data.created_at) : null
      newDeposit.transactionUpdatedAt = data.updated_at ? new Date(data.updated_at) : null

      // Bank Account data
      if (data.bank_account) {
        newDeposit.bankAccountId = data.bank_account.id
        newDeposit.bankAccountName = data.bank_account.account_name
        newDeposit.bankAccountNumber = data.bank_account.account_number
        newDeposit.bankName = data.bank_account.bank_name
        newDeposit.bankCode = data.bank_account.bank_code
        newDeposit.bankType = data.bank_account.type
        newDeposit.bankRoutingNumber = data.bank_account.routing_number ?? null
        newDeposit.bankSwiftCode = data.bank_account.swift_code ?? null
        newDeposit.bankIban = data.bank_account.iban ?? null
        newDeposit.bankBalance = data.bank_account.balance
        newDeposit.bankCurrency = data.bank_account.currency
        newDeposit.bankCurrencySettlement = data.bank_account.currency_settlement
        newDeposit.bankCreditPending = data.bank_account.credit_pending
        newDeposit.bankDebitPending = data.bank_account.debit_pending
        newDeposit.bankStatus = data.bank_account.status
        newDeposit.bankHolderId = data.bank_account.holder_id
        newDeposit.bankHolderType = data.bank_account.holder_type ?? null
        newDeposit.bankCreatedAt = data.bank_account.created_at
          ? new Date(data.bank_account.created_at)
          : null
        newDeposit.bankUpdatedAt = data.bank_account.updated_at
          ? new Date(data.bank_account.updated_at)
          : null

        // Bank Address
        if (data.bank_account.bank_address) {
          newDeposit.bankAddressLine1 = data.bank_account.bank_address.line1
          newDeposit.bankAddressLine2 = data.bank_account.bank_address.line2 ?? null
          newDeposit.bankAddressCity = data.bank_account.bank_address.city
          newDeposit.bankAddressState = data.bank_account.bank_address.state ?? null
          newDeposit.bankAddressCountry = data.bank_account.bank_address.country
          newDeposit.bankAddressPostalCode = data.bank_account.bank_address.postal_code
        }

        // Beneficiary Address
        if (data.bank_account.beneficiary_address) {
          newDeposit.beneficiaryAddressLine1 = data.bank_account.beneficiary_address.line1
          newDeposit.beneficiaryAddressLine2 = data.bank_account.beneficiary_address.line2 ?? null
          newDeposit.beneficiaryAddressCity = data.bank_account.beneficiary_address.city
          newDeposit.beneficiaryAddressState = data.bank_account.beneficiary_address.state ?? null
          newDeposit.beneficiaryAddressCountry = data.bank_account.beneficiary_address.country
          newDeposit.beneficiaryAddressPostalCode =
            data.bank_account.beneficiary_address.postal_code
        }
      }

      // Wallet account data
      if (data.wallet_account) {
        newDeposit.walletAccountId = data.wallet_account.id
        newDeposit.walletCurrency = data.wallet_account.currency
        newDeposit.walletBalance = data.wallet_account.balance
        newDeposit.walletKind = data.wallet_account.kind
        newDeposit.walletStatus = data.wallet_account.status
      }

      // Deposit details
      if (data.deposit) {
        newDeposit.id = data.deposit.id // Use the deposit ID as primary ID
        newDeposit.depositObjectType = data.deposit.object_type
        newDeposit.depositAccountType = data.deposit.account_type
        newDeposit.depositType = data.deposit.type
        newDeposit.depositConfirmations = data.deposit.confirmations
        newDeposit.depositAmountSource = data.deposit.amount_source
        newDeposit.depositAmountSettled = data.deposit.amount_settled
        newDeposit.depositFee = data.deposit.fee
        newDeposit.depositSettlementType = data.deposit.settlement_type
        newDeposit.depositSettlementRate = data.deposit.settlement_rate
        newDeposit.depositCurrencySource = data.deposit.currency_source
        newDeposit.depositCreatedAt = data.deposit.created_at
          ? new Date(data.deposit.created_at)
          : null
        newDeposit.depositUpdatedAt = data.deposit.updated_at
          ? new Date(data.deposit.updated_at)
          : null

        // Payer details if available
        if (data.deposit.payer) {
          newDeposit.payerAccountName = data.deposit.payer.account_name ?? null
          newDeposit.payerAccountNumber = data.deposit.payer.account_number ?? null
          newDeposit.payerBankCode = data.deposit.payer.bank_code ?? null
          newDeposit.payerBankName = data.deposit.payer.bank_name ?? null
          newDeposit.payerRoutingNumber = data.deposit.payer.routing_number ?? null
          newDeposit.payerRoutingType = data.deposit.payer.routing_type ?? null
          newDeposit.payerRoutingRail = data.deposit.payer.routing_rail ?? null
          newDeposit.payerTraceNumber = data.deposit.payer.trace_number ?? null
          newDeposit.payerSessionId = data.deposit.payer.session_id ?? null
          newDeposit.depositNetwork = data.deposit.payer.network ?? null
          newDeposit.depositChainHash = data.deposit.payer.chain_hash ?? null
        }
      }

      // Save the deposit to the database
      const savedDeposit = await this.depositRepository.save(newDeposit)
      this.logger.log(`Deposit saved successfully with ID: ${savedDeposit.id}`)

      // You can add additional logic here, such as notifying users or updating other services
    } catch (error) {
      this.logger.error(`Error processing deposit webhook: ${error.message}`, error.stack)
      throw error
    }
  }

  async findAll(
    page = 1,
    limit = 10,
    accountId?: string,
    status?: string,
    startDate?: Date,
    endDate?: Date,
  ): Promise<{
    deposits: Deposit[]
    total: number
    page: number
    limit: number
    totalPages: number
  }> {
    try {
      const queryBuilder = this.depositRepository.createQueryBuilder('deposit')

      // Apply filters if provided
      if (accountId) {
        queryBuilder.andWhere('deposit.accountId = :accountId', { accountId })
      }

      if (status) {
        queryBuilder.andWhere('deposit.status = :status', { status })
      }

      if (startDate) {
        queryBuilder.andWhere('deposit.transactionCreatedAt >= :startDate', {
          startDate: startDate.toISOString(),
        })
      }

      if (endDate) {
        queryBuilder.andWhere('deposit.transactionCreatedAt <= :endDate', {
          endDate: endDate.toISOString(),
        })
      }

      // Add sorting - newest first
      queryBuilder.orderBy('deposit.transactionCreatedAt', 'DESC')

      // Calculate pagination
      const skip = (page - 1) * limit

      // Get total count for pagination metadata
      const total = await queryBuilder.getCount()

      // Apply pagination
      queryBuilder.skip(skip).take(limit)

      // Execute query
      const deposits = await queryBuilder.getMany()

      // Calculate total pages
      const totalPages = Math.ceil(total / limit)

      return {
        deposits,
        total,
        page,
        limit,
        totalPages,
      }
    } catch (error) {
      this.logger.error(`Error fetching deposits: ${error.message}`, error.stack)
      throw error
    }
  }

  async findOne(id: string): Promise<Deposit> {
    try {
      const deposit = await this.depositRepository.findOne({ where: { id } })

      if (!deposit) {
        throw new NotFoundException(`Deposit with ID ${id} not found`)
      }

      return deposit
    } catch (error) {
      this.logger.error(`Error fetching deposit with ID ${id}: ${error.message}`, error.stack)
      throw error
    }
  }

  async findByTransactionId(transactionId: string): Promise<Deposit> {
    try {
      const deposit = await this.depositRepository.findOne({
        where: { transactionId },
      })

      if (!deposit) {
        throw new NotFoundException(`Deposit with transaction ID ${transactionId} not found`)
      }

      return deposit
    } catch (error) {
      this.logger.error(
        `Error fetching deposit with transaction ID ${transactionId}: ${error.message}`,
        error.stack,
      )
      throw error
    }
  }
}
