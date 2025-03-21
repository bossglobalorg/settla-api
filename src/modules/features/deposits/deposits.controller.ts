import {
  Body,
  Controller,
  Get,
  Logger,
  NotFoundException,
  Param,
  ParseUUIDPipe,
  Post,
  Query,
} from '@nestjs/common'

import { DepositsService } from './deposits.service'
import { DepositWebhookDto } from './dto/deposit-webhook.dto'
import { FindDepositsDto } from './dto/find-deposits.dto'

@Controller('deposits')
export class DepositsController {
  private readonly logger = new Logger(DepositsController.name)

  constructor(private readonly depositsService: DepositsService) {}

  @Post('webhook')
  async handleDepositWebhook(@Body() webhookData: DepositWebhookDto) {
    this.logger.log(`Received deposit webhook`)
    return this.depositsService.handleDepositWebhook(webhookData)
  }

  @Get()
  async findAll(@Query() query: FindDepositsDto) {
    this.logger.log(`Fetching deposits with filters: ${JSON.stringify(query)}`)

    // Parse dates if provided
    const startDate = query.startDate ? new Date(query.startDate) : undefined
    const endDate = query.endDate ? new Date(query.endDate) : undefined

    return this.depositsService.findAll(
      query.page,
      query.limit,
      query.accountId,
      query.status,
      startDate,
      endDate,
    )
  }

  @Get(':id')
  async findOne(@Param('id', ParseUUIDPipe) id: string) {
    this.logger.log(`Fetching deposit with ID: ${id}`)

    const deposit = await this.depositsService.findOne(id)

    if (!deposit) {
      throw new NotFoundException(`Deposit with ID ${id} not found`)
    }

    return deposit
  }

  @Get('transaction/:transactionId')
  async findByTransactionId(@Param('transactionId') transactionId: string) {
    this.logger.log(`Fetching deposit with transaction ID: ${transactionId}`)

    const deposit = await this.depositsService.findByTransactionId(transactionId)

    if (!deposit) {
      throw new NotFoundException(`Deposit with transaction ID ${transactionId} not found`)
    }

    return deposit
  }
}
