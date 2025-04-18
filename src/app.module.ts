import { MiddlewareConsumer, Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { ThrottlerModule } from '@nestjs/throttler'

import { BankAccountsModule } from '@features/bank_account/bank_accounts.module'
import { BusinessModule } from '@features/business/business.module'
import { DepositsModule } from '@features/deposits/deposits.module'
import { PayoutsModule } from '@features/payouts/payout.module'
import { UserModule } from '@features/user/user.module'
import { WalletsModule } from '@features/wallets/wallets.module'

import { DbModule } from './db/db.module'
import { GlobalModule } from './global/global.module'
import { AsyncStorageMiddleware } from './global/middleware/async-storage/async-storage.middleware'
import { GraphModule } from './modules/providers/graph/graph.module'
import { HealthModule } from './modules/system/health/health.module'
import { LoggerModule } from './modules/system/logger/logger.module'
import { getConfig } from './services/app-config/configuration'

@Module({
  imports: [
    GlobalModule,
    ConfigModule.forRoot({
      cache: true,
      load: [getConfig],
    }),
    DbModule,
    UserModule,
    BusinessModule,
    ConfigModule,
    LoggerModule,
    HealthModule,
    GraphModule,
    DepositsModule,
    PayoutsModule,
    BankAccountsModule,
    WalletsModule,
    ThrottlerModule.forRoot([
      {
        ttl: 60,
        limit: 10,
      },
    ]),
  ],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AsyncStorageMiddleware).forRoutes('*')
  }
}
