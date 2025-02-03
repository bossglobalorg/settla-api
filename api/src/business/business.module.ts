import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HttpModule } from '@nestjs/axios';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { Business } from './entities/business.entity';
import { BusinessController } from './business.controller';
import { BusinessService } from './services/business/business.service';
import { KybService } from './services/kyb/kyb.service';
import { CloudinaryService } from 'src/global/services/cloudinary/cloudinary.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Business]),
    HttpModule,
    ConfigModule.forRoot({
      isGlobal: true, // This makes ConfigModule available throughout the app
    }),
  ],
  controllers: [BusinessController],
  providers: [BusinessService, KybService, ConfigService, CloudinaryService],
  exports: [BusinessService],
})
export class BusinessModule {}
