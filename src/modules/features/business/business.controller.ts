import { PartnerEntityType, PartnerName } from 'src/global/enums/partner-reference.enum'
import { PartnerReferenceService } from 'src/global/services/partner-reference/partner-reference.service'

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
  constructor(
    private readonly businessService: BusinessService,
    private readonly partnerService: PartnerReferenceService,
  ) {}

  @Post('basic-info')
  @UsePipes(ValidationPipe)
  async createBusinessBasicInfo(
    @Req() req: Request & { user: { id: string; businessName: string } },
    @Body() basicInfoData: BusinessBasicInfoDto,
  ): Promise<{ data: Business; message: string }> {
    try {
      const existingBusiness = await this.businessService.findByOwnerId(req.user.id)

      if (existingBusiness.length) {
        throw new HttpException(
          {
            message: 'Business already exists for this user',
            errors: ['A business has already been created for this user'],
          },
          HttpStatus.CONFLICT,
        )
      }

      const partnerReference = await this.partnerService.findReference(
        req.user.id,
        PartnerEntityType.USER,
        PartnerName.GRAPH,
      )

      if (!partnerReference) {
        throw new HttpException(
          {
            message: 'Identity verification required',
            errors: [
              'Your account requires KYC verification. Please complete the verification process to access this feature.',
            ],
          },
          HttpStatus.NOT_FOUND,
        )
      }

      const businessData = {
        owner_id: partnerReference.entity_id,
        partner_entity_id: partnerReference.partner_entity_id,
        name: req.user.businessName,
        business_type: basicInfoData.business_type,
        industry: basicInfoData.industry,
        contact_phone: basicInfoData.contact_phone,
        contact_email: basicInfoData.contact_email,
        address: {
          line1: basicInfoData.line1,
          line2: basicInfoData.line2,
          city: basicInfoData.city,
          state: basicInfoData.state,
          country: basicInfoData.country,
          postal_code: basicInfoData.postal_code,
        },
        registration_status: 'basic_info_completed',
      }

      return {
        message: 'Business basic information created successfully',
        data: await this.businessService.createBasicInfo(businessData),
      }
    } catch (error) {
      console.log(error)
      if (error instanceof HttpException) {
        throw error
      }
      throw new HttpException(
        {
          message: 'Failed to create business basic information',
          errors: [error.message],
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      )
    }
  }

  @Post(':businessId/identification')
  @UsePipes(ValidationPipe)
  async addBusinessIdentification(
    @Param('businessId') businessId: string,
    @Body() identificationData: BusinessIdentificationDto,
  ): Promise<{ data: Business; message: string }> {
    try {
      const formattedData = {
        ...identificationData,
        dof: new Date(identificationData.dof),
        registration_status: 'identification_completed',
      }

      return {
        message: 'Business identification information created successfully',
        data: await this.businessService.addIdentification(businessId, formattedData),
      }
    } catch (error) {
      if (error instanceof HttpException) {
        throw error
      }
      throw new HttpException(
        {
          message: 'Failed to add business identification',
          errors: [error.message],
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      )
    }
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
