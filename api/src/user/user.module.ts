import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { AuthService } from './services/auth/auth.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from './entities/user.entity';
import { UserService } from './services/user/user.service';
import { PasswordService } from './services/password/password.service';
import { JwtService } from './services/jwt/jwt.service';
import { ConfigModule } from '@nestjs/config';
import { JwtStrategy } from './services/auth/strategies/jwt/jwt.strategy';
import { AppCacheModule } from '../app-cache/app-cache.module';
import { OTPService } from './services/otp/otp.service';
import { UserKycController } from './user.kyc.controller';
import { UserKycService } from './services/kyc/kyc.service';
import { GraphService } from 'src/global/services/graph/graph.service';
import { HttpService } from '@nestjs/axios';
import { PartnerReferenceService } from 'src/global/services/partner-reference/partner-reference.service';
import { Business } from 'src/business/entities/business.entity';
import { PartnerReference } from 'src/global/entities/partner-reference.entity';
import { HttpModule } from '@nestjs/axios';
import { CloudinaryService } from 'src/global/services/cloudinary/cloudinary.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([UserEntity, Business, PartnerReference]),
    HttpModule,
    ConfigModule,
    AppCacheModule,
  ],
  controllers: [UserController, UserKycController],
  providers: [
    AuthService,
    UserService,
    OTPService,
    PasswordService,
    JwtService,
    JwtStrategy,
    UserKycService,
    GraphService,
    PartnerReferenceService,
    CloudinaryService
  ],
})
export class UserModule {}
