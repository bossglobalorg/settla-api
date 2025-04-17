import { GraphService } from 'src/modules/providers/graph/graph.service'
import { Repository } from 'typeorm'

import { Injectable, Logger, NotFoundException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'

import { UserService } from '@features/user/services/user/user.service'
import { PartnerEntityType, PartnerName } from '@global/enums/partner-reference.enum'
import { BankAccountResponseDto } from '@providers/graph/dto/create-bank-account-response.dto'

import { CreateBankAccountDto } from './dto/create_bank_account.dto'
import { FindBankAccountsDto } from './dto/find_bank_accounts.dto'
import { UpdateBankAccountDto } from './dto/update_bank_account.dto'
import { BankAccount } from './entities/bank_account.entity'

// Define interface for Graph bank account response
interface GraphBankAccount {
  id: string
  account_number: string
  account_name: string
  bank_name: string
  bank_code: string
  currency: string
  branch_code?: string
  swift_code?: string
  routing_number?: string
  iban?: string
  type: string
  status: string
  whitelist_enabled: boolean
  whitelist?: object
  autosweep_enabled: boolean
  master_account_id?: string
  label: string
  is_verified: boolean
  is_primary: boolean
  is_deleted: boolean
  created_at: string
  updated_at: string
  business_id?: string
  person_id?: string
  user_id?: string
  metadata?: object
}

@Injectable()
export class BankAccountsService {
  private readonly logger = new Logger(BankAccountsService.name)

  constructor(
    @InjectRepository(BankAccount)
    private readonly bankAccountRepository: Repository<BankAccount>,
    private readonly graphService: GraphService,
    private readonly userService: UserService,
  ) {}

  async createBankAccount(
    createBankAccountDto: CreateBankAccountDto,
    userId: string,
  ): Promise<BankAccount> {
    try {
      this.logger.log(`Creating new bank account`)

      const entityType =
        createBankAccountDto.accountType === 'user'
          ? PartnerEntityType.USER
          : PartnerEntityType.BUSINESS

      const { partnerEntityId } = await this.userService.getUserEntityId(
        userId,
        PartnerName.GRAPH,
        entityType,
      )

      const payload = this.mapRequestToPayload(createBankAccountDto, partnerEntityId)
      const response = await this.graphService.createBankAccount(payload)

      const bankAccountData = this.mapResponseToEntity(response, createBankAccountDto, userId)

      return this.saveBankAccount(bankAccountData)
    } catch (error) {
      this.logger.error(`Error creating bank account: ${error.message}`, error.stack)
      throw error
    }
  }

  async findAll(filters: FindBankAccountsDto = {}): Promise<{
    bankAccounts: BankAccount[]
    total: number
    page: number
    limit: number
    totalPages: number
  }> {
    try {
      this.logger.log(`Finding bank accounts with filters: ${JSON.stringify(filters)}`)
      const page = filters.page || 1
      const limit = filters.limit || 10

      const queryBuilder = this.bankAccountRepository.createQueryBuilder('bankAccount')
      // Always exclude deleted accounts
      queryBuilder.where('bankAccount.isDeleted = :isDeleted', { isDeleted: false })

      // Apply filters if provided
      if (filters.userId) {
        queryBuilder.andWhere('bankAccount.userId = :userId', { userId: filters.userId })
      }

      if (filters.businessId) {
        queryBuilder.andWhere('bankAccount.businessId = :businessId', {
          businessId: filters.businessId,
        })
      }

      if (filters.personId) {
        queryBuilder.andWhere('bankAccount.personId = :personId', { personId: filters.personId })
      }

      if (filters.status) {
        queryBuilder.andWhere('bankAccount.status = :status', { status: filters.status })
      }

      if (filters.currency) {
        queryBuilder.andWhere('bankAccount.currency = :currency', { currency: filters.currency })
      }

      // Add sorting - newest first
      queryBuilder.orderBy('bankAccount.createdAt', 'DESC')

      // Calculate pagination
      const skip = (page - 1) * limit

      // Get total count for pagination metadata
      const total = await queryBuilder.getCount()

      // Apply pagination
      queryBuilder.skip(skip).take(limit)

      // Execute query
      let bankAccounts = await queryBuilder.getMany()

      // If no bank accounts found and we have user/business/person ID, try to fetch from Graph
      if (bankAccounts.length === 0 && (filters.userId || filters.businessId || filters.personId)) {
        this.logger.log('No bank accounts found in database, fetching from Graph')

        const fetchedAccounts = await this.fetchAndSaveBankAccounts(
          filters.userId,
          filters.businessId,
          filters.personId,
        )

        // Apply pagination to the fetched accounts
        const startIdx = skip
        const endIdx = startIdx + limit
        bankAccounts = fetchedAccounts.slice(startIdx, endIdx)

        // Recalculate total for pagination
        const newTotal = fetchedAccounts.length
        const newTotalPages = Math.ceil(newTotal / limit)

        return {
          bankAccounts,
          total: newTotal,
          page,
          limit,
          totalPages: newTotalPages,
        }
      }

      // Calculate total pages
      const totalPages = Math.ceil(total / limit)

      return {
        bankAccounts,
        total,
        page,
        limit,
        totalPages,
      }
    } catch (error) {
      this.logger.error(`Error fetching bank accounts: ${error.message}`, error.stack)
      throw error
    }
  }

  async findOne(id: string): Promise<BankAccount | null> {
    try {
      this.logger.log(`Finding bank account with ID: ${id}`)

      const bankAccount = await this.bankAccountRepository.findOne({
        where: {
          id,
          isDeleted: false,
        },
      })

      // If bank account not found, fetch from Graph and check if it exists
      if (!bankAccount) {
        this.logger.log(`Bank account with ID ${id} not found in database, fetching from Graph`)
        const bankAccounts = await this.fetchAndSaveBankAccounts()
        return bankAccounts.find((account) => account.id === id) || null
      }

      return bankAccount
    } catch (error) {
      this.logger.error(`Error fetching bank account with ID ${id}: ${error.message}`, error.stack)
      throw error
    }
  }

  async findByUser(userId: string): Promise<BankAccount[]> {
    try {
      this.logger.log(`Finding bank accounts for user ID: ${userId}`)

      const bankAccounts = await this.bankAccountRepository.find({
        where: {
          userId,
          isDeleted: false,
        },
        order: {
          isPrimary: 'DESC',
          createdAt: 'DESC',
        },
      })

      return bankAccounts
    } catch (error) {
      this.logger.error(
        `Error fetching bank accounts for user ${userId}: ${error.message}`,
        error.stack,
      )
      throw error
    }
  }

  async findByBusiness(businessId: string): Promise<BankAccount[]> {
    try {
      this.logger.log(`Finding bank accounts for business ID: ${businessId}`)

      const bankAccounts = await this.bankAccountRepository.find({
        where: {
          businessId,
          isDeleted: false,
        },
        order: {
          isPrimary: 'DESC',
          createdAt: 'DESC',
        },
      })

      // If no bank accounts found for this business, fetch from Graph and save to database
      if (bankAccounts.length === 0) {
        this.logger.log(`No bank accounts found for business ${businessId}, fetching from Graph`)
        return this.fetchAndSaveBankAccounts(undefined, businessId)
      }

      return bankAccounts
    } catch (error) {
      this.logger.error(
        `Error fetching bank accounts for business ${businessId}: ${error.message}`,
        error.stack,
      )
      throw error
    }
  }

  async update(
    id: string,
    updateBankAccountDto: UpdateBankAccountDto,
  ): Promise<BankAccount | null> {
    try {
      const bankAccount = await this.findOne(id)

      if (!bankAccount) {
        return null
      }

      // If setting this account as primary and it wasn't before
      if (updateBankAccountDto.isPrimary && !bankAccount.isPrimary) {
        await this.resetOtherPrimaryAccounts(
          bankAccount.userId,
          bankAccount.businessId,
          bankAccount.holderId,
        )
      }

      // Update the account with new data
      Object.assign(bankAccount, updateBankAccountDto)

      const updatedAccount = await this.bankAccountRepository.save(bankAccount)
      this.logger.log(`Bank account updated successfully with ID: ${updatedAccount.id}`)

      return updatedAccount
    } catch (error) {
      this.logger.error(`Error updating bank account with ID ${id}: ${error.message}`, error.stack)
      throw error
    }
  }

  async setPrimary(id: string): Promise<BankAccount> {
    try {
      const bankAccount = await this.findOne(id)

      if (!bankAccount) {
        throw new NotFoundException(`Bank account with ID ${id} not found`)
      }

      // Reset any other primary accounts
      await this.resetOtherPrimaryAccounts(
        bankAccount.userId,
        bankAccount.businessId,
        bankAccount.holderId,
      )

      // Set this account as primary
      bankAccount.isPrimary = true

      const updatedAccount = await this.bankAccountRepository.save(bankAccount)
      this.logger.log(`Bank account set as primary with ID: ${updatedAccount.id}`)

      return updatedAccount
    } catch (error) {
      this.logger.error(
        `Error setting bank account ${id} as primary: ${error.message}`,
        error.stack,
      )
      throw error
    }
  }

  async remove(id: string): Promise<boolean> {
    try {
      const bankAccount = await this.findOne(id)

      if (!bankAccount) {
        return false
      }

      // Soft delete by setting isDeleted flag
      bankAccount.isDeleted = true

      // If this was a primary account, we need to clear that flag
      if (bankAccount.isPrimary) {
        bankAccount.isPrimary = false
      }

      await this.bankAccountRepository.save(bankAccount)
      this.logger.log(`Bank account soft deleted with ID: ${id}`)

      return true
    } catch (error) {
      this.logger.error(`Error deleting bank account with ID ${id}: ${error.message}`, error.stack)
      throw error
    }
  }

  // Helper methods for saving accounts
  async saveBankAccount(bankAccountData: Partial<BankAccount>): Promise<BankAccount> {
    this.logger.log(`Saving bank account with ID: ${bankAccountData.id}`)

    const bankAccount = this.bankAccountRepository.create(bankAccountData)
    return this.bankAccountRepository.save(bankAccount)
  }

  async saveBankAccounts(bankAccountsData: Partial<BankAccount>[]): Promise<BankAccount[]> {
    this.logger.log(`Saving ${bankAccountsData.length} bank accounts`)

    const bankAccounts = bankAccountsData.map((data) => this.bankAccountRepository.create(data))
    return this.bankAccountRepository.save(bankAccounts)
  }

  // Helper method to fetch accounts from Graph
  private async fetchAndSaveBankAccounts(
    userId?: string,
    businessId?: string,
    personId?: string,
  ): Promise<BankAccount[]> {
    try {
      // Fetch bank accounts from Graph - assume a method like this exists
      const graphBankAccounts = await this.graphService.listBankAccounts()

      if (!graphBankAccounts || graphBankAccounts?.data?.length === 0) {
        this.logger.log('No bank accounts returned from Graph')
        return []
      }

      // Map Graph bank accounts to our entity structure
      const bankAccountsToSave = graphBankAccounts.data.map((graphAccount: GraphBankAccount) => {
        return {
          id: graphAccount.id,
          accountNumber: graphAccount.account_number,
          accountName: graphAccount.account_name,
          bankName: graphAccount.bank_name,
          bankCode: graphAccount.bank_code,
          currency: graphAccount.currency,
          branchCode: graphAccount.branch_code,
          swiftCode: graphAccount.swift_code,
          routingNumber: graphAccount.routing_number,
          iban: graphAccount.iban,
          type: graphAccount.type,
          status: graphAccount.status,
          whitelistEnabled: graphAccount.whitelist_enabled,
          whitelist: graphAccount.whitelist,
          autosweepEnabled: graphAccount.autosweep_enabled,
          masterAccountId: graphAccount.master_account_id,
          label: graphAccount.label,
          isVerified: graphAccount.is_verified,
          isPrimary: graphAccount.is_primary,
          isDeleted: graphAccount.is_deleted || false,
          createdAt: new Date(graphAccount.created_at),
          updatedAt: new Date(graphAccount.updated_at),
          businessId: graphAccount.business_id || businessId,
          personId: graphAccount.person_id || personId,
          userId: graphAccount.user_id || userId,
          metadata: graphAccount.metadata,
        }
      })

      // Save bank accounts to database
      const savedBankAccounts = await this.saveBankAccounts(bankAccountsToSave)
      this.logger.log(`Saved ${savedBankAccounts.length} bank accounts from Graph`)

      // Filter results based on provided IDs
      let results = savedBankAccounts

      if (userId) {
        results = results.filter((account) => account.userId === userId)
      }

      if (businessId) {
        results = results.filter((account) => account.businessId === businessId)
      }

      if (personId) {
        results = results.filter((account) => account.holderId === personId)
      }

      return results
    } catch (error) {
      this.logger.error('Failed to fetch bank accounts from Graph', error)
      // Return empty array in case of error
      return []
    }
  }

  // Helper method to ensure only one primary account per user/business
  private async resetOtherPrimaryAccounts(
    userId?: string,
    businessId?: string,
    personId?: string,
  ): Promise<void> {
    const queryBuilder = this.bankAccountRepository
      .createQueryBuilder('bankAccount')
      .where('bankAccount.isPrimary = :isPrimary', { isPrimary: true })
      .andWhere('bankAccount.isDeleted = :isDeleted', { isDeleted: false })

    if (userId) {
      queryBuilder.andWhere('bankAccount.userId = :userId', { userId })
    }

    if (businessId) {
      queryBuilder.andWhere('bankAccount.businessId = :businessId', { businessId })
    }

    if (personId) {
      queryBuilder.andWhere('bankAccount.personId = :personId', { personId })
    }

    const primaryAccounts = await queryBuilder.getMany()

    if (primaryAccounts.length > 0) {
      this.logger.log(`Resetting ${primaryAccounts.length} previous primary accounts`)

      for (const account of primaryAccounts) {
        account.isPrimary = false
      }

      await this.bankAccountRepository.save(primaryAccounts)
    }
  }

  private mapResponseToEntity(
    response: BankAccountResponseDto,
    requestDto: CreateBankAccountDto,
    userId: string,
  ): Partial<BankAccount> {
    return {
      id: response.id,
      accountNumber: response.account_number,
      accountName: response.account_name,
      bankName: response.bank_name,
      bankCode: response.bank_code,
      currency: response.currency,
      type: response.type,
      status: response.status,
      routingNumber: response.routing_number,
      businessId: requestDto.businessId,
      holderId: response.holder_id,
      userId,
      label: response.label,
      whitelistEnabled: requestDto.whitelistEnabled,
      whitelist: requestDto.whitelist,
      autosweepEnabled: requestDto.autosweepEnabled,
      balance: response.balance,
      metadata: response,
      isPrimary: requestDto.isPrimary || false,
      isVerified: false,
      isDeleted: response.is_deleted || false,
      createdAt: new Date(response.created_at),
      updatedAt: new Date(response.updated_at),
    }
  }

  private mapRequestToPayload(
    request: CreateBankAccountDto,
    partnerEntityId: string,
  ): Record<string, unknown> {
    const payload: Record<string, unknown> = {
      label: request.label,
      currency: request.currency,
      autosweep_enabled: request.autosweepEnabled,
      whitelist_enabled: request.whitelistEnabled,
    }

    if (request.accountType === 'user') {
      payload.person_id = partnerEntityId
    } else {
      payload.business_id = partnerEntityId
    }

    return payload
  }
}
