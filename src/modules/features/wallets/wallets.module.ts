import { GraphService } from 'src/modules/providers/graph/graph.service'

import { HttpModule } from '@nestjs/axios'
import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'

import { Business } from '@features/business/entities/business.entity'
import { User } from '@features/user/entities/user.entity'
import { PartnerReferenceService } from '@global/services/partner-reference/partner-reference.service'
import { GraphModule } from '@providers/graph/graph.module'
import { GraphUtils } from '@providers/graph/graph.utils'

import { WalletAccount } from './entities/wallet-account.entity'
import { WalletsController } from './wallets.controller'
import { WalletsService } from './wallets.service'

@Module({
  imports: [TypeOrmModule.forFeature([WalletAccount, Business, User]), HttpModule, GraphModule],
  controllers: [WalletsController],
  providers: [WalletsService],
  exports: [WalletsService],
})
export class WalletsModule {}
