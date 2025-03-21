import { GraphService } from 'src/modules/providers/graph/graph.service'
import { Repository } from 'typeorm'

import { Injectable, Logger } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'

import { FindWalletAccountsDto } from './dto/find-wallet-accounts.dto'
import { WalletAccount } from './entities/wallet-account.entity'

// Define interface for Graph wallet account response
interface GraphWalletAccount {
  id: string
  currency: string
  balance: number
  block_expiry: string | null
  kind: string
  status: string
  is_deleted: boolean
  created_at: string
  updated_at: string
  userId?: string
}

@Injectable()
export class WalletsService {
  private readonly logger = new Logger(WalletsService.name)

  constructor(
    @InjectRepository(WalletAccount)
    private walletAccountRepository: Repository<WalletAccount>,
    private readonly graphService: GraphService,
  ) {}

  async saveWalletAccount(walletAccountData: Partial<WalletAccount>): Promise<WalletAccount> {
    this.logger.log(`Saving wallet account with ID: ${walletAccountData.id}`)

    const walletAccount = this.walletAccountRepository.create(walletAccountData)
    return this.walletAccountRepository.save(walletAccount)
  }

  async saveWalletAccounts(walletAccountsData: Partial<WalletAccount>[]): Promise<WalletAccount[]> {
    this.logger.log(`Saving ${walletAccountsData.length} wallet accounts`)

    const walletAccounts = walletAccountsData.map((data) =>
      this.walletAccountRepository.create(data),
    )
    return this.walletAccountRepository.save(walletAccounts)
  }

  async findAll(filters: FindWalletAccountsDto = {}): Promise<WalletAccount[]> {
    this.logger.log(`Finding wallet accounts with filters: ${JSON.stringify(filters)}`)

    const query = this.walletAccountRepository.createQueryBuilder('wallet_account')

    if (filters.userId) {
      query.andWhere('wallet_account.userId = :userId', { userId: filters.userId })
    }

    if (filters.currency) {
      query.andWhere('wallet_account.currency = :currency', { currency: filters.currency })
    }

    if (filters.status) {
      query.andWhere('wallet_account.status = :status', { status: filters.status })
    }

    // Only return non-deleted accounts
    query.andWhere('wallet_account.isDeleted = :isDeleted', { isDeleted: false })

    const walletAccounts = await query.getMany()

    // If no wallet accounts found, fetch from Graph and save to database
    if (walletAccounts.length === 0) {
      this.logger.log('No wallet accounts found in database, fetching from Graph')
      return this.fetchAndSaveWalletAccounts(filters.userId)
    }

    return walletAccounts
  }

  async findOne(id: string): Promise<WalletAccount | null> {
    this.logger.log(`Finding wallet account with ID: ${id}`)

    const walletAccount = await this.walletAccountRepository.findOne({
      where: {
        id,
        isDeleted: false,
      },
    })

    // If wallet account not found, fetch all from Graph and check if the requested one exists
    if (!walletAccount) {
      this.logger.log(`Wallet account with ID ${id} not found in database, fetching from Graph`)
      const walletAccounts = await this.fetchAndSaveWalletAccounts()
      return walletAccounts.find((account) => account.id === id) || null
    }

    return walletAccount
  }

  async findByUserId(userId: string): Promise<WalletAccount[]> {
    this.logger.log(`Finding wallet accounts for user ID: ${userId}`)

    const walletAccounts = await this.walletAccountRepository.find({
      where: {
        userId,
        isDeleted: false,
      },
    })

    // If no wallet accounts found for this user, fetch from Graph and save to database
    if (walletAccounts.length === 0) {
      this.logger.log(`No wallet accounts found for user ${userId}, fetching from Graph`)
      return this.fetchAndSaveWalletAccounts(userId)
    }

    return walletAccounts
  }

  private async fetchAndSaveWalletAccounts(userId?: string): Promise<WalletAccount[]> {
    try {
      // Fetch wallet accounts from Graph
      const graphWalletAccounts = await this.graphService.listWallets()

      if (!graphWalletAccounts || graphWalletAccounts.length === 0) {
        this.logger.log('No wallet accounts returned from Graph')
        return []
      }

      // Map Graph wallet accounts to our entity structure
      const walletAccountsToSave = graphWalletAccounts.map((graphWallet: GraphWalletAccount) => {
        return {
          id: graphWallet.id,
          currency: graphWallet.currency,
          balance: graphWallet.balance,
          blockExpiry: graphWallet.block_expiry ? new Date(graphWallet.block_expiry) : null,
          kind: graphWallet.kind,
          status: graphWallet.status,
          isDeleted: graphWallet.is_deleted || false,
          createdAt: new Date(graphWallet.created_at),
          updatedAt: new Date(graphWallet.updated_at),
          // If userId is provided, assign it to all fetched wallets
          // In a real-world scenario, you might need more complex logic to determine the userId
          userId: userId || graphWallet.userId || 'default-user-id',
        }
      })

      // Save wallet accounts to database
      const savedWalletAccounts = await this.saveWalletAccounts(walletAccountsToSave)
      this.logger.log(`Saved ${savedWalletAccounts.length} wallet accounts from Graph`)

      // If userId is provided, filter the results
      if (userId) {
        return savedWalletAccounts.filter((account) => account.userId === userId)
      }

      return savedWalletAccounts
    } catch (error) {
      this.logger.error('Failed to fetch wallet accounts from Graph', error)
      // Return empty array in case of error
      return []
    }
  }
}
