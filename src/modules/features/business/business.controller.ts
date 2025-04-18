import {
  Body,
  Controller,
  DefaultValuePipe,
  Delete,
  Get,
  HttpException,
  HttpStatus,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Query,
  Req,
  UploadedFiles,
  UseFilters,
  UseGuards,
  UseInterceptors,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common'
import { FileFieldsInterceptor } from '@nestjs/platform-express'

import { AllExceptionsFilter } from '@global/filters/http-exception.filter'

import { JwtAuthGuard } from '../user/guards/jwt-auth/jwt-auth.guard'
import { BusinessBasicInfoDto } from './dto/basic-business.dto'
import { BusinessIdentificationDto } from './dto/business-identification.dto'
import { UpdateBusinessDto } from './dto/update-business.dto'
import { Business } from './entities/business.entity'
import { BusinessDocumentFiles, BusinessService } from './services/business/business.service'

@Controller('businesses')
@UseGuards(JwtAuthGuard)
@UseFilters(AllExceptionsFilter)
export class BusinessController {
  constructor(private readonly businessService: BusinessService) {}

  @Post('basic-info')
  @UsePipes(ValidationPipe)
  async createBusinessBasicInfo(
    @Req() req: Request & { user: { id: string; businessName: string } },
    @Body() basicInfoData: BusinessBasicInfoDto,
  ): Promise<{ data: Business; message: string }> {
    return await this.businessService.createBusinessWithBasicInfo(req.user, basicInfoData)
  }

  @Post(':businessId/identification')
  @UsePipes(ValidationPipe)
  async addBusinessIdentification(
    @Param('businessId') businessId: string,
    @Body() identificationData: BusinessIdentificationDto,
  ): Promise<{ data: Business; message: string }> {
    return await this.businessService.updateBusinessIdentification(businessId, identificationData)
  }

  @Post(':businessId/documents')
  @UseInterceptors(
    FileFieldsInterceptor([
      { name: 'business_registration', maxCount: 1 },
      { name: 'proof_of_address', maxCount: 1 },
    ]),
  )
  @UsePipes(ValidationPipe)
  async uploadBusinessDocuments(
    @Param('businessId') businessId: string,
    @UploadedFiles() files: BusinessDocumentFiles,
  ): Promise<Business> {
    return await this.businessService.processBusinessDocuments(businessId, files)
  }

  @Get()
  async getAllBusinesses(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number,
  ) {
    try {
      return await this.businessService.findAll(page, limit)
    } catch (error) {
      throw new HttpException('Failed to fetch businesses', HttpStatus.INTERNAL_SERVER_ERROR)
    }
  }

  @Get(':id')
  async getBusinessById(@Param('id') id: string): Promise<Business> {
    const business = await this.businessService.findOne(id)
    if (!business) {
      throw new HttpException('Business not found', HttpStatus.NOT_FOUND)
    }
    return business
  }

  @Get('owner/:ownerId')
  async getBusinessesByOwnerId(@Param('ownerId') ownerId: string) {
    try {
      return await this.businessService.findByOwnerId(ownerId)
    } catch (error) {
      throw new HttpException('Failed to fetch owner businesses', HttpStatus.INTERNAL_SERVER_ERROR)
    }
  }

  @Put(':id')
  async updateBusiness(
    @Param('id') id: string,
    @Body() updateBusinessDto: UpdateBusinessDto,
  ): Promise<Business> {
    try {
      const business = await this.businessService.update(id, updateBusinessDto)
      if (!business) {
        throw new HttpException('Business not found', HttpStatus.NOT_FOUND)
      }
      return business
    } catch (error) {
      throw new HttpException('Failed to update business', HttpStatus.INTERNAL_SERVER_ERROR)
    }
  }

  @Delete(':id')
  async deleteBusiness(@Param('id') id: string) {
    try {
      const result = await this.businessService.remove(id)
      if (!result) {
        throw new HttpException('Business not found', HttpStatus.NOT_FOUND)
      }
      return { message: 'Business deleted successfully' }
    } catch (error) {
      throw new HttpException('Failed to delete business', HttpStatus.INTERNAL_SERVER_ERROR)
    }
  }

  @Post(':id/verify')
  async initiateBusinessVerification(@Param('id') id: string) {
    try {
      return await this.businessService.initiateKYBVerification(id)
    } catch (error) {
      throw new HttpException(
        'Failed to initiate business verification',
        HttpStatus.INTERNAL_SERVER_ERROR,
      )
    }
  }

  @Get(':id/verification-status')
  async getVerificationStatus(@Param('id') id: string) {
    try {
      return await this.businessService.getKYBStatus(id)
    } catch (error) {
      throw new HttpException(
        'Failed to fetch verification status',
        HttpStatus.INTERNAL_SERVER_ERROR,
      )
    }
  }

  @Post(':id/upload-document')
  async uploadBusinessDocument(@Param('id') id: string, @Body() documentData: any) {
    try {
      return await this.businessService.uploadDocument(id, documentData)
    } catch (error) {
      throw new HttpException('Failed to upload document', HttpStatus.INTERNAL_SERVER_ERROR)
    }
  }

  @Get(':id/documents')
  async getBusinessDocuments(@Param('id') id: string) {
    try {
      return await this.businessService.getDocuments(id)
    } catch (error) {
      throw new HttpException(
        'Failed to fetch business documents',
        HttpStatus.INTERNAL_SERVER_ERROR,
      )
    }
  }
}
