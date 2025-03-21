import { Controller, Get, Logger, NotFoundException, Param, Query } from '@nestjs/common'

import { FindWalletAccountsDto } from './dto/find-wallet-accounts.dto'
import { WalletsService } from './wallets.service'

@Controller('wallets')
export class WalletsController {
  private readonly logger = new Logger(WalletsController.name)

  constructor(private readonly walletsService: WalletsService) {}

  @Get()
  async findAll(@Query() query: FindWalletAccountsDto) {
    this.logger.log(`Fetching wallet accounts with filters: ${JSON.stringify(query)}`)
    return this.walletsService.findAll(query)
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    this.logger.log(`Fetching wallet account with ID: ${id}`)

    const walletAccount = await this.walletsService.findOne(id)

    if (!walletAccount) {
      throw new NotFoundException(`Wallet account with ID ${id} not found`)
    }

    return walletAccount
  }

  @Get('user/:userId')
  async findByUserId(@Param('userId') userId: string) {
    this.logger.log(`Fetching wallet accounts for user ID: ${userId}`)

    const walletAccounts = await this.walletsService.findByUserId(userId)

    return walletAccounts
  }
}
