import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HttpModule } from '@nestjs/axios';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { Business } from './entities/business.entity';
import { BusinessController } from './business.controller';
import { BusinessService } from './services/business/business.service';
import { CloudinaryService } from 'src/global/services/cloudinary/cloudinary.service';
import { GraphService } from 'src/global/services/graph/graph.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Business]),
    HttpModule,
    ConfigModule.forRoot({
      isGlobal: true, 
    }),
  ],
  controllers: [BusinessController],
  providers: [BusinessService, ConfigService, CloudinaryService, GraphService],
  exports: [BusinessService],
})
export class BusinessModule {}
