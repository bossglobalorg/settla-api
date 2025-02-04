import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Business } from 'src/business/entities/business.entity';
import { PartnerReference } from 'src/global/entities/partner-reference.entity';
import { UserEntity } from 'src/user/entities/user.entity';
import { GraphService } from './graph.service';
import { PartnerReferenceService } from '../partner-reference/partner-reference.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Business, PartnerReference, UserEntity]),
    HttpModule,
  ],
  providers: [GraphService, PartnerReferenceService],
  exports: [GraphService],
})
export class GraphModule {}
