import { GraphService } from 'src/modules/providers/graph/graph.service'
import { Repository } from 'typeorm'

import { Injectable, Logger, NotFoundException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'

import { DepositWebhookDto } from './dto/deposit-webhook.dto'
import { Deposit } from './entities/deposit.entity'

@Injectable()
export class DepositsService {
  private readonly logger = new Logger(DepositsService.name)

  constructor(
    private readonly graphService: GraphService,
    @InjectRepository(Deposit)
    private readonly depositRepository: Repository<Deposit>,
  ) {}

  async createDeposit(deposit: any) {
    // const user = await this.graphService.getUser(deposit.userId)
  }

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
      newDeposit.amount = data.amount
      newDeposit.balanceBefore = data.balance_before
      newDeposit.balanceAfter = data.balance_after
      newDeposit.currency = data.currency
      newDeposit.description = data.description
      newDeposit.status = data.status
      newDeposit.type = data.type
      newDeposit.kind = data.kind
      newDeposit.linkedTransactionId = data.linked_transaction_id ?? ''
      newDeposit.payoutId = data.payout_id ?? ''
      newDeposit.transactionCreatedAt = new Date(data.created_at)
      newDeposit.transactionUpdatedAt = new Date(data.updated_at)

      // Wallet account data
      newDeposit.walletAccountId = data.wallet_account.id
      newDeposit.walletCurrency = data.wallet_account.currency
      newDeposit.walletBalance = data.wallet_account.balance
      newDeposit.walletKind = data.wallet_account.kind
      newDeposit.walletStatus = data.wallet_account.status

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
        newDeposit.depositCreatedAt = new Date(data.deposit.created_at)
        newDeposit.depositUpdatedAt = new Date(data.deposit.updated_at)

        // Payer details if available
        if (data.deposit.payer) {
          newDeposit.depositNetwork = data.deposit.payer.network
          newDeposit.depositChainHash = data.deposit.payer.chain_hash
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
