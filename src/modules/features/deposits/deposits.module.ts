import { GraphService } from 'src/modules/providers/graph/graph.service'

import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'

import { DepositsController } from './deposits.controller'
import { DepositsService } from './deposits.service'
import { Deposit } from './entities/deposit.entity'

@Module({
  imports: [TypeOrmModule.forFeature([Deposit])],
  controllers: [DepositsController],
  providers: [DepositsService, GraphService],
  exports: [DepositsService],
})
export class DepositsModule {}
