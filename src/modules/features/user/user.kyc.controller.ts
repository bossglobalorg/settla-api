import { CloudinaryService } from 'src/modules/providers/cloudinary/cloudinary.service'

import {
  Body,
  Controller,
  Param,
  Post,
  Req,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common'
import { FileInterceptor } from '@nestjs/platform-express'

import { KycDocumentService } from '@features/kyc_documents/kyc-documents.service'

import { BackgroundInfoDto } from './dto/kyc/background-info.dto'
import { DocumentDto } from './dto/kyc/document.dto'
import { IdentificationDto } from './dto/kyc/identification.dto'
import { PersonalInfoDto } from './dto/kyc/personal-info.dto'
import { JwtAuthGuard } from './guards/jwt-auth/jwt-auth.guard'
import { UserKycService } from './services/kyc/kyc.service'

@Controller('users/kyc')
@UseGuards(JwtAuthGuard)
export class UserKycController {
  constructor(
    private readonly userKycService: UserKycService,
    private readonly cloudinaryService: CloudinaryService,
    private readonly kycDocumentService: KycDocumentService,
  ) {}

  @Post('personal-info')
  async submitPersonalInfo(
    @Req() req: Request & { user: { id: string } },
    @Body() personalInfo: PersonalInfoDto,
  ) {
    return await this.userKycService.savePersonalInfo(req.user.id, personalInfo)
  }

  @Post('identification')
  async submitIdentification(
    @Req() req: Request & { user: { id: string } },
    @Body() identification: IdentificationDto,
  ) {
    return await this.userKycService.saveIdentification(req.user.id, identification)
  }

  @Post('background')
  async submitBackgroundInfo(
    @Req() req: Request & { user: { id: string } },
    @Body() backgroundInfo: BackgroundInfoDto,
  ) {
    return await this.userKycService.saveBackgroundInfo(req.user.id, backgroundInfo)
  }

  @Post('documents')
  @UseInterceptors(FileInterceptor('document'))
  async submitDocument(
    @Req() req: Request & { user: { id: string } },
    @Body() documentInfo: Omit<DocumentDto, 'document_url'>,
    @UploadedFile() file: Express.Multer.File,
  ) {
    const uploadedUrl = await this.cloudinaryService.uploadDocument(file)
    const document: DocumentDto = {
      ...documentInfo,
      documentUrl: uploadedUrl.secure_url,
    }
    await this.kycDocumentService.create(req.user.id, document)
    return await this.userKycService.sendDocumentsToKycPartner(req.user.id, document)
  }
}
