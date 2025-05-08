import { PartnerReference } from 'src/global/entities/partner-reference.entity'

import { HttpModule } from '@nestjs/axios'
import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { TypeOrmModule } from '@nestjs/typeorm'

import { Business } from '@features/business/entities/business.entity'
import { KycDocument } from '@features/kyc_documents/entities/kyc-document.entity'
import { KycDocumentService } from '@features/kyc_documents/kyc-documents.service'
import { PartnerReferenceService } from '@global/services/partner-reference/partner-reference.service'
import { CloudinaryService } from '@providers/cloudinary/cloudinary.service'
import { GraphModule } from '@providers/graph/graph.module'
import { AppCacheModule } from '@system/app-cache/app-cache.module'

import { User } from './entities/user.entity'
import { AuthService } from './services/auth/auth.service'
import { JwtStrategy } from './services/auth/strategies/jwt/jwt.strategy'
import { JwtService } from './services/jwt/jwt.service'
import { UserKycService } from './services/kyc/kyc.service'
import { OTPService } from './services/otp/otp.service'
import { PasswordService } from './services/password/password.service'
import { UserService } from './services/user/user.service'
import { UserController } from './user.controller'
import { UserKycController } from './user.kyc.controller'

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Business, PartnerReference, KycDocument]),
    HttpModule,
    ConfigModule,
    AppCacheModule,
    GraphModule,
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
    PartnerReferenceService,
    CloudinaryService,
    KycDocumentService,
  ],
  exports: [UserService],
})
export class UserModule {}
