import { MiddlewareConsumer, Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { DbModule } from './db/db.module'
import { getConfig } from './services/app-config/configuration'
import { LoggerModule } from './modules/system/logger/logger.module'
import { AsyncStorageMiddleware } from './global/middleware/async-storage/async-storage.middleware'
import { GlobalModule } from './global/global.module'
import { HealthModule } from './modules/system/health/health.module'
import { ThrottlerModule } from '@nestjs/throttler'
import { GraphModule } from './modules/providers/graph/graph.module'
import { UserModule } from '@features/user/user.module'
import { BusinessModule } from '@features/business/business.module'

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
