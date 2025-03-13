import { GraphService } from 'src/modules/providers/graph/graph.service'

import { HttpModule } from '@nestjs/axios'
import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'

import { UserService } from '@features/user/services/user/user.service'
import { UserModule } from '@features/user/user.module'
import { GraphModule } from '@providers/graph/graph.module'

import { BankAccountsController } from './bank_accounts.controller'
import { BankAccountsService } from './bank_accounts.service'
import { BankAccount } from './entities/bank_account.entity'

@Module({
  imports: [TypeOrmModule.forFeature([BankAccount]), GraphModule, HttpModule, UserModule],
  controllers: [BankAccountsController],
  providers: [BankAccountsService],
  exports: [BankAccountsService],
})
export class BankAccountsModule {}
