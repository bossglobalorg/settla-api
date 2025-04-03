import {
  Body,
  Controller,
  Delete,
  Get,
  Logger,
  NotFoundException,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common'
import { ApiTags } from '@nestjs/swagger'

import { JwtAuthGuard } from '@features/user/guards/jwt-auth/jwt-auth.guard'

import { BankAccountsService } from './bank_accounts.service'
import { CreateBankAccountDto } from './dto/create_bank_account.dto'
import { FindBankAccountsDto } from './dto/find_bank_accounts.dto'
import { UpdateBankAccountDto } from './dto/update_bank_account.dto'

@ApiTags('bank_accounts')
@Controller('bank-accounts')
@UseGuards(JwtAuthGuard)
export class BankAccountsController {
  private readonly logger = new Logger(BankAccountsController.name)

  constructor(private readonly bankAccountsService: BankAccountsService) {}

  @Post()
  async create(
    @Body() createBankAccountDto: CreateBankAccountDto,
    @Req() req: Request & { user: { id: string } },
  ) {
    this.logger.log(`Creating new bank account`)
    return this.bankAccountsService.createBankAccount(createBankAccountDto, req.user.id)
  }

  @Get(':id')
  async findOne(@Param('id', ParseUUIDPipe) id: string) {
    this.logger.log(`Fetching bank account with ID: ${id}`)

    const bankAccount = await this.bankAccountsService.findOne(id)

    if (!bankAccount) {
      throw new NotFoundException(`Bank account with ID ${id} not found`)
    }

    return bankAccount
  }

  @Get()
  async findAll(@Param('userId') userId: string, @Req() req: Request & { user: { id: string } }) {
    this.logger.log(`Fetching bank accounts for user: ${userId}`)

    return this.bankAccountsService.findByUser(req.user.id)
  }

  @Get('business/:businessId')
  async findByBusiness(@Param('businessId') businessId: string) {
    this.logger.log(`Fetching bank accounts for business: ${businessId}`)

    return this.bankAccountsService.findByBusiness(businessId)
  }

  @Patch(':id')
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateBankAccountDto: UpdateBankAccountDto,
  ) {
    this.logger.log(`Updating bank account with ID: ${id}`)

    const updated = await this.bankAccountsService.update(id, updateBankAccountDto)

    if (!updated) {
      throw new NotFoundException(`Bank account with ID ${id} not found`)
    }

    return updated
  }

  @Patch(':id/set-primary')
  async setPrimary(@Param('id', ParseUUIDPipe) id: string) {
    this.logger.log(`Setting bank account ${id} as primary`)

    return this.bankAccountsService.setPrimary(id)
  }

  @Delete(':id')
  async remove(@Param('id', ParseUUIDPipe) id: string) {
    this.logger.log(`Soft deleting bank account with ID: ${id}`)

    const deleted = await this.bankAccountsService.remove(id)

    if (!deleted) {
      throw new NotFoundException(`Bank account with ID ${id} not found`)
    }

    return { success: true, message: 'Bank account deleted successfully' }
  }
}
