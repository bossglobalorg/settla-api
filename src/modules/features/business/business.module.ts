import { HttpModule } from '@nestjs/axios'
import { Module } from '@nestjs/common'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { TypeOrmModule } from '@nestjs/typeorm'

import { PartnerReference } from '@global/entities/partner-reference.entity'
import { PartnerReferenceService } from '@global/services/partner-reference/partner-reference.service'
import { CloudinaryService } from '@providers/cloudinary/cloudinary.service'
import { GraphModule } from '@providers/graph/graph.module'

import { BusinessController } from './business.controller'
import { Business } from './entities/business.entity'
import { BusinessService } from './services/business/business.service'

@Module({
  imports: [
    TypeOrmModule.forFeature([Business, PartnerReference]),
    HttpModule,
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    GraphModule,
  ],
  controllers: [BusinessController],
  providers: [BusinessService, ConfigService, CloudinaryService, PartnerReferenceService],
  exports: [BusinessService],
})
export class BusinessModule {}
