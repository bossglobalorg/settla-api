import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HttpModule } from '@nestjs/axios';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { Business } from './entities/business.entity';
import { BusinessController } from './business.controller';
import { BusinessService } from './services/business/business.service';
import { CloudinaryService } from 'src/global/services/cloudinary/cloudinary.service';
import { GraphService } from 'src/global/services/graph/graph.service';
import { PartnerReferenceService } from 'src/global/services/partner-reference/partner-reference.service';
import { PartnerReference } from 'src/global/entities/partner-reference.entity'; // Add this import
import { UserEntity } from 'src/user/entities/user.entity';
import { GraphModule } from 'src/global/services/graph/graph.module';
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
  providers: [
    BusinessService,
    ConfigService,
    CloudinaryService,
    PartnerReferenceService,
  ],
  exports: [BusinessService],
})
export class BusinessModule {}
