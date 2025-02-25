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
import { JwtAuthGuard } from './guards/jwt-auth/jwt-auth.guard'
import { UserKycService } from './services/kyc/kyc.service'
import { PersonalInfoDto } from './dto/kyc/personal-info.dto'
import { IdentificationDto } from './dto/kyc/identification.dto'
import { BackgroundInfoDto } from './dto/kyc/background-info.dto'
import { FileInterceptor } from '@nestjs/platform-express'
import { DocumentDto } from './dto/kyc/document.dto'
import { CloudinaryService } from 'src/modules/providers/cloudinary/cloudinary.service'

@Controller('users/kyc')
@UseGuards(JwtAuthGuard)
export class UserKycController {
  constructor(
    private readonly userKycService: UserKycService,
    private readonly cloudinaryService: CloudinaryService
  ) {}

  @Post('personal-info')
  async submitPersonalInfo(
    @Req() req: Request & { user: { id: string } },
    @Body() personalInfo: PersonalInfoDto
  ) {
    return await this.userKycService.savePersonalInfo(req.user.id, personalInfo)
  }

  @Post('identification')
  async submitIdentification(
    @Req() req: Request & { user: { id: string } },
    @Body() identification: IdentificationDto
  ) {
    return await this.userKycService.saveIdentification(
      req.user.id,
      identification
    )
  }

  @Post('background')
  async submitBackgroundInfo(
    @Req() req: Request & { user: { id: string } },
    @Body() backgroundInfo: BackgroundInfoDto
  ) {
    return await this.userKycService.saveBackgroundInfo(
      req.user.id,
      backgroundInfo
    )
  }

  @Post('documents')
  @UseInterceptors(FileInterceptor('document'))
  async submitDocument(
    @Req() req: Request & { user: { id: string } },
    @Body() documentInfo: Omit<DocumentDto, 'document_url'>,
    @UploadedFile() file: Express.Multer.File
  ) {
    const uploadedUrl = await this.cloudinaryService.uploadDocument(file)
    const document: DocumentDto = {
      ...documentInfo,
      document_url: uploadedUrl.secure_url,
    }
    return await this.userKycService.addDocument(req.user.id, document)
  }
}
