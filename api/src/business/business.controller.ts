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
  DefaultValuePipe,
  ParseIntPipe,
  UploadedFile,
  UseInterceptors,
  ValidationPipe,
  UseFilters,
  UsePipes,
} from '@nestjs/common';
import { BusinessService } from './services/business/business.service';
import { JwtAuthGuard } from '../user/guards/jwt-auth/jwt-auth.guard';
import { UpdateBusinessDto } from './dto/update-business.dto';
import { Business } from './entities/business.entity';
import { CloudinaryService } from '../global/services/cloudinary/cloudinary.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { AllExceptionsFilter } from 'src/global/filters/http-exception.filter';
import { CreateBusinessDto } from './dto/create-business.dto';

@Controller('businesses')
@UseGuards(JwtAuthGuard)
@UseFilters(AllExceptionsFilter)
export class BusinessController {
  constructor(
    private readonly businessService: BusinessService,
    private readonly cloudinaryService: CloudinaryService,
  ) {}

  @Post()
  @UseInterceptors(FileInterceptor('id_document'))
  @UsePipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
      errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY,
    }),
  )
  async createBusiness(
    @Req() req: Request & { user: { id: string } },
    @Body() rawBusinessData: any,
    @UploadedFile() file: Express.Multer.File,
  ): Promise<Business> {
    try {
      if (!file) {
        throw new HttpException(
          {
            message: 'Validation failed',
            errors: ['Business ID document is required'],
          },
          HttpStatus.BAD_REQUEST,
        );
      }

      const uploadResult = await this.cloudinaryService.uploadDocument(file);

      let address;
      if ('address' in rawBusinessData && rawBusinessData.address) {
        address = rawBusinessData.address;
      } else {
        address = {
          line1: rawBusinessData['address.line1'],
          line2: rawBusinessData['address.line2'],
          city: rawBusinessData['address.city'],
          state: rawBusinessData['address.state'],
          country: rawBusinessData['address.country'],
          postal_code: rawBusinessData['address.postal_code'],
        };
      }

      // Construct the business data
      const businessData: CreateBusinessDto = {
        ...rawBusinessData,
        owner_id: req.user.id,
        id_upload: uploadResult.secure_url,
        address,
        dof: new Date(rawBusinessData.dof),
      };

      return await this.businessService.create(businessData);
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(
        {
          message: 'Failed to create business',
          errors: [error.message],
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get()
  async getAllBusinesses(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number,
  ) {
    try {
      return await this.businessService.findAll(page, limit);
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
