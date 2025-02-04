import {
  Body,
  Controller,
  Param,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { JwtAuthGuard } from './guards/jwt-auth/jwt-auth.guard';
import { UserKycService } from './services/kyc/kyc.service';
import { PersonalInfoDto } from './dto/kyc/personal-info.dto';
import { IdentificationDto } from './dto/kyc/identification.dto';
import { BackgroundInfoDto } from './dto/kyc/background-info.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { DocumentDto } from './dto/kyc/document.dto';
import { CloudinaryService } from 'src/global/services/cloudinary/cloudinary.service';

@Controller('users/:userId/kyc')
@UseGuards(JwtAuthGuard)
export class UserKycController {
  constructor(
    private readonly userKycService: UserKycService,
    private readonly cloudinaryService: CloudinaryService,
  ) {}

  @Post('personal-info')
  async submitPersonalInfo(
    @Param('userId') userId: string,
    @Body() personalInfo: PersonalInfoDto,
  ) {
    return await this.userKycService.savePersonalInfo(userId, personalInfo);
  }

  @Post('identification')
  async submitIdentification(
    @Param('userId') userId: string,
    @Body() identification: IdentificationDto,
  ) {
    return await this.userKycService.saveIdentification(userId, identification);
  }

  @Post('background')
  async submitBackgroundInfo(
    @Param('userId') userId: string,
    @Body() backgroundInfo: BackgroundInfoDto,
  ) {
    return await this.userKycService.saveBackgroundInfo(userId, backgroundInfo);
  }

  @Post('documents')
  @UseInterceptors(FileInterceptor('document'))
  async submitDocument(
    @Param('userId') userId: string,
    @Body() documentInfo: Omit<DocumentDto, 'document_url'>,
    @UploadedFile() file: Express.Multer.File,
  ) {
    const uploadedUrl = await this.cloudinaryService.uploadDocument(file);
    const document: DocumentDto = {
      ...documentInfo,
      document_url: uploadedUrl.secure_url,
    };
    return await this.userKycService.addDocument(userId, document);
  }
}
