import { redisStore } from 'cache-manager-redis-store'
import { CacheConfig } from 'src/services/app-config/configuration'

import { CacheModuleOptions, CacheOptionsFactory } from '@nestjs/cache-manager'
import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'

@Injectable()
export class CacheConfigService implements CacheOptionsFactory {
  constructor(private readonly configService: ConfigService) {}

  createCacheOptions(): CacheModuleOptions {
    return {
      // @ts-expect-error
      store: async () => {
        return await redisStore({
          url: this.configService.get<CacheConfig>('cache')?.url,
        })
      },
    }
  }
}
