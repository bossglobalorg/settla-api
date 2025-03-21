import { HttpModule } from '@nestjs/axios'
import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'

import { Business } from '@features/business/entities/business.entity'
import { UserEntity } from '@features/user/entities/user.entity'
import { PartnerReference } from '@global/entities/partner-reference.entity'

import { PartnerReferenceService } from '../../../global/services/partner-reference/partner-reference.service'
import { GraphService } from './graph.service'
import { GraphUtils } from './graph.utils'

@Module({
  imports: [TypeOrmModule.forFeature([Business, PartnerReference, UserEntity]), HttpModule],
  providers: [GraphService, GraphUtils, PartnerReferenceService],
  exports: [GraphService, GraphUtils],
})
export class GraphModule {}
