// src/business/business.controller.ts
import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  UseGuards,
  Query,
  HttpStatus,
  HttpException,
  Req,
} from '@nestjs/common';
import { BusinessService } from './services/business/business.service';
import { JwtAuthGuard } from '../user/guards/jwt-auth/jwt-auth.guard';
import { CreateBusinessDto } from './dto/create-business.dto';
import { UpdateBusinessDto } from './dto/update-business.dto';
import { Business } from './entities/business.entity';

@Controller('businesses')
@UseGuards(JwtAuthGuard)
export class BusinessController {
  constructor(private readonly businessService: BusinessService) {}

  // business.controller.ts
  @Post()
  async createBusiness(
    @Req() req: Request & { user: { id: string } },
    @Body()
    createBusinessDto: Omit<CreateBusinessDto, 'owner_id' | 'id_upload'>,
  ): Promise<Business> {
    try {
      // Create the complete business data
      const businessData: CreateBusinessDto = {
        ...createBusinessDto,
        owner_id: req.user.id,
        id_upload: 'placeholder',
      };

      return await this.businessService.create(businessData);
    } catch (error) {
      throw new HttpException(
        'Failed to create business',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get()
  async getAllBusinesses(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
  ) {
    try {
      const businesses = await this.businessService.findAll(page, limit);
      return businesses;
    } catch (error) {
      throw new HttpException(
        'Failed to fetch businesses',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get(':id')
  async getBusinessById(@Param('id') id: string): Promise<Business> {
    const business = await this.businessService.findOne(id);
    if (!business) {
      throw new HttpException('Business not found', HttpStatus.NOT_FOUND);
    }
    return business;
  }

  @Get('owner/:ownerId')
  async getBusinessesByOwnerId(@Param('ownerId') ownerId: string) {
    try {
      return await this.businessService.findByOwnerId(ownerId);
    } catch (error) {
      throw new HttpException(
        'Failed to fetch owner businesses',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Put(':id')
  async updateBusiness(
    @Param('id') id: string,
    @Body() updateBusinessDto: UpdateBusinessDto,
  ): Promise<Business> {
    try {
      const business = await this.businessService.update(id, updateBusinessDto);
      if (!business) {
        throw new HttpException('Business not found', HttpStatus.NOT_FOUND);
      }
      return business;
    } catch (error) {
      throw new HttpException(
        'Failed to update business',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Delete(':id')
  async deleteBusiness(@Param('id') id: string) {
    try {
      const result = await this.businessService.remove(id);
      if (!result) {
        throw new HttpException('Business not found', HttpStatus.NOT_FOUND);
      }
      return { message: 'Business deleted successfully' };
    } catch (error) {
      throw new HttpException(
        'Failed to delete business',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Post(':id/verify')
  async initiateBusinessVerification(@Param('id') id: string) {
    try {
      return await this.businessService.initiateKYBVerification(id);
    } catch (error) {
      throw new HttpException(
        'Failed to initiate business verification',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get(':id/verification-status')
  async getVerificationStatus(@Param('id') id: string) {
    try {
      return await this.businessService.getKYBStatus(id);
    } catch (error) {
      throw new HttpException(
        'Failed to fetch verification status',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Post(':id/upload-document')
  async uploadBusinessDocument(
    @Param('id') id: string,
    @Body() documentData: any,
  ) {
    try {
      return await this.businessService.uploadDocument(id, documentData);
    } catch (error) {
      throw new HttpException(
        'Failed to upload document',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get(':id/documents')
  async getBusinessDocuments(@Param('id') id: string) {
    try {
      return await this.businessService.getDocuments(id);
    } catch (error) {
      throw new HttpException(
        'Failed to fetch business documents',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
