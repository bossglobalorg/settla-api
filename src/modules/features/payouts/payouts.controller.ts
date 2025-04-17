import { Body, Controller, Get, Param, Post, Query, Req, UseGuards } from '@nestjs/common'

import { JwtAuthGuard } from '@features/user/guards/jwt-auth/jwt-auth.guard'

import { CreatePayoutDestinationDto } from './dto/create-payout-destination.dto'
import { CreatePayoutDto } from './dto/create-payout.dto'
import { PaginationParamsDto } from './dto/list-payout-destinations.dto'
import { PayoutDestination } from './entities/payout-destination.entity'
import { Payout } from './entities/payout.entity'
import { PayoutsService } from './payouts.service'

@Controller('payouts')
@UseGuards(JwtAuthGuard)
export class PayoutsController {
  constructor(private readonly payoutsService: PayoutsService) {}

  // Payout Destinations Endpoints
  @Post('destinations')
  async createPayoutDestination(
    @Body() payload: CreatePayoutDestinationDto,
    @Req() req: Request & { user: { id: string } },
  ): Promise<PayoutDestination> {
    return this.payoutsService.createPayoutDestination(payload, req.user.id)
  }

  @Get('destinations')
  async listPayoutDestinations(
    @Query() params: PaginationParamsDto,
    @Req() req: Request & { user: { id: string } },
  ) {
    return this.payoutsService.listPayoutDestinations(req.user.id, params)
  }

  @Get('destinations/:id')
  async getPayoutDestination(
    @Param('id') id: string,
    @Req() req: Request & { user: { id: string } },
  ) {
    return this.payoutsService.findPayoutDestinations(id, req.user.id)
  }

  // Payouts Endpoints
  @Post()
  async createPayout(
    @Body() payload: CreatePayoutDto,
    @Req() req: Request & { user: { id: string } },
  ): Promise<Payout> {
    return this.payoutsService.createPayout(payload, req.user.id)
  }

  @Get()
  async listPayouts(
    @Query() params: PaginationParamsDto,
    @Req() req: Request & { user: { id: string } },
  ) {
    return this.payoutsService.listPayouts(req.user.id, params)
  }

  @Get(':id')
  async getPayout(@Param('id') id: string, @Req() req: Request & { user: { id: string } }) {
    return this.payoutsService.getPayout(id, req.user.id)
  }
}
