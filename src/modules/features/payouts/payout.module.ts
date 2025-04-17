import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'

import { PayoutDestination } from './entities/payout-destination.entity'
import { Payout } from './entities/payout.entity'
import { PayoutsController } from './payouts.controller'
import { PayoutsService } from './payouts.service'

@Module({
  imports: [TypeOrmModule.forFeature([PayoutDestination, Payout])],
  controllers: [PayoutsController],
  providers: [PayoutsService],
})
export class PayoutsModule {}
