import { GraphService } from 'src/modules/providers/graph/graph.service'

import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'

import { WalletAccount } from './entities/wallet-account.entity'
import { WalletsController } from './wallets.controller'
import { WalletsService } from './wallets.service'

@Module({
  imports: [TypeOrmModule.forFeature([WalletAccount])],
  controllers: [WalletsController],
  providers: [WalletsService, GraphService],
  exports: [WalletsService],
})
export class WalletsModule {}
