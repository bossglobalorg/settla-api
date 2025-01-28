// src/business/services/business.service.ts
import { Injectable, HttpException, HttpStatus, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Business } from '../../entities/business.entity';
import { CreateBusinessDto } from '../../dto/create-business.dto';
import { UpdateBusinessDto } from '../../dto/update-business.dto';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class BusinessService {
  constructor(
    @InjectRepository(Business)
    private readonly businessRepository: Repository<Business>,
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {}

  async create(createBusinessDto: CreateBusinessDto): Promise<Business> {
    try {
      const business = this.businessRepository.create(createBusinessDto);
      return await this.businessRepository.save(business);
    } catch (error) {
      throw new HttpException(
        'Failed to create business',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async findAll(page?: string | number, limit?: string | number) {
    try {
      // Convert page and limit to numbers and set defaults
      const currentPage = page ? parseInt(String(page), 10) : 1;
      const itemsPerPage = limit ? parseInt(String(limit), 10) : 10;

      // Validate the numbers
      if (isNaN(currentPage) || isNaN(itemsPerPage)) {
        throw new HttpException(
          'Invalid pagination parameters',
          HttpStatus.BAD_REQUEST,
        );
      }

      const [businesses, total] = await this.businessRepository.findAndCount({
        skip: (currentPage - 1) * itemsPerPage,
        take: itemsPerPage,
        order: { dateCreated: 'DESC' },
      });

      return {
        data: businesses,
        meta: {
          total,
          page: currentPage,
          limit: itemsPerPage,
          totalPages: Math.ceil(total / itemsPerPage),
        },
      };
    } catch (error) {
      console.log({ error });
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(
        'Failed to fetch businesses',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async findOne(id: string): Promise<Business> {
    try {
      const business = await this.businessRepository.findOne({
        where: { id },
      });

      if (!business) {
        throw new HttpException('Business not found', HttpStatus.NOT_FOUND);
      }

      return business;
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(
        'Failed to fetch business',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async findByOwnerId(ownerId: string): Promise<Business[]> {
    try {
      return await this.businessRepository.find({
        where: { owner_id: ownerId },
        order: { dateCreated: 'DESC' },
      });
    } catch (error) {
      throw new HttpException(
        'Failed to fetch owner businesses',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async update(
    id: string,
    updateBusinessDto: UpdateBusinessDto,
  ): Promise<Business> {
    try {
      const business = await this.findOne(id);

      if (!business) {
        throw new HttpException('Business not found', HttpStatus.NOT_FOUND);
      }

      Object.assign(business, updateBusinessDto);
      return await this.businessRepository.save(business);
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(
        'Failed to update business',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async remove(id: string): Promise<boolean> {
    try {
      const result = await this.businessRepository.delete(id);
      if (result.affected === 0) {
        throw new HttpException('Business not found', HttpStatus.NOT_FOUND);
      }
      return true;
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(
        'Failed to delete business',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async initiateKYBVerification(id: string) {
    try {
      const business = await this.findOne(id);

      // Call third-party KYB service
      const verificationResponse = await this.httpService.axiosRef.post(
        `${this.configService.get('KYB_API_URL')}/verify`,
        {
          businessId: business.id,
          businessName: business.name,
          businessType: business.business_type,
          registrationNumber: business.id_number,
          country: business.id_country,
          // Add other required fields for KYB
        },
        {
          headers: {
            Authorization: `Bearer ${this.configService.get('KYB_API_KEY')}`,
          },
        },
      );

      // Update business with verification response
      business.kyb_status = 'pending';
      business.kyb_response = verificationResponse.data;
      await this.businessRepository.save(business);

      return verificationResponse.data;
    } catch (error) {
      throw new HttpException(
        'Failed to initiate KYB verification',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async getKYBStatus(id: string) {
    try {
      const business = await this.findOne(id);
      return {
        status: business.kyb_status,
        response: business.kyb_response,
      };
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(
        'Failed to fetch KYB status',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async uploadDocument(id: string, documentData: any) {
    try {
      const business = await this.findOne(id);

      // Handle document upload logic here
      // You might want to use a file upload service or store in your database

      business.id_upload = documentData.documentUrl; // Assuming documentUrl is provided
      return await this.businessRepository.save(business);
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(
        'Failed to upload document',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async getDocuments(id: string) {
    try {
      const business = await this.findOne(id);
      return {
        id_upload: business.id_upload,
        // Add other document fields as needed
      };
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(
        'Failed to fetch documents',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  // Helper method for validating business data
  private async validateBusinessData(
    data: CreateBusinessDto | UpdateBusinessDto,
  ) {
    // Add custom validation logic here
    // For example, checking if the business name is unique
    const existingBusiness = await this.businessRepository.findOne({
      where: { name: data.name },
    });

    if (existingBusiness) {
      throw new HttpException(
        'Business name already exists',
        HttpStatus.BAD_REQUEST,
      );
    }
  }
}
