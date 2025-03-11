import { GraphService } from 'src/modules/providers/graph/graph.service'

import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'

import { GraphModule } from '@providers/graph/graph.module'

import { DepositsController } from './deposits.controller'
import { DepositsService } from './deposits.service'
import { Deposit } from './entities/deposit.entity'

@Module({
  imports: [TypeOrmModule.forFeature([Deposit]), GraphModule],
  controllers: [DepositsController],
  providers: [DepositsService],
  exports: [DepositsService],
})
export class DepositsModule {}
