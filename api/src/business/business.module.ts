import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Business } from './entities/business.entity';
import { BusinessController } from './business.controller';
import { KybService } from './services/kyb/kyb.service';
import { BusinessService } from './services/business/business.service';

@Module({
  imports: [TypeOrmModule.forFeature([Business])],
  controllers: [BusinessController],
  providers: [KybService, BusinessService],
})
export class BusinessModule {}
