// src/business/services/business/business.service.ts
import {
  Injectable,
  HttpException,
  HttpStatus,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Not, Repository } from 'typeorm';
import { Business } from '../../entities/business.entity';
import { CreateBusinessDto } from '../../dto/create-business.dto';
import { UpdateBusinessDto } from '../../dto/update-business.dto';
import { BusinessIdentificationDto } from 'src/business/dto/business-identification.dto';
import { GraphService } from 'src/global/services/graph/graph.service';

@Injectable()
export class BusinessService {
  constructor(
    @InjectRepository(Business)
    private readonly businessRepository: Repository<Business>,
    private readonly graphService: GraphService,
  ) {}

  async createBasicInfo(
    businessData: Partial<CreateBusinessDto>,
  ): Promise<Business> {
    const business = this.businessRepository.create(businessData);
    return await this.businessRepository.save(business);
  }

  async addIdentification(
    businessId: string,
    identificationData: BusinessIdentificationDto,
  ): Promise<Business> {
    const business = await this.businessRepository.findOne({
      where: { id: businessId },
    });

    if (!business) {
      throw new NotFoundException('Business not found');
    }

    // Update individual identification fields
    business.id_type = identificationData.id_type;
    business.id_number = identificationData.id_number;
    business.id_country = identificationData.id_country;
    business.id_level = identificationData.id_level;
    business.dof = identificationData.dof;
    business.registration_status = 'identification_completed';

    return await this.businessRepository.save(business);
  }

  async addDocuments(
    businessId: string,
    documents: {
      business_registration_doc: string;
      proof_of_address_doc?: string;
      registration_status: string;
    },
  ): Promise<Business> {
    const business = await this.businessRepository.findOne({
      where: { id: businessId },
    });

    if (!business) {
      throw new NotFoundException('Business not found');
    }

    // Update document fields
    business.business_registration_doc = documents.business_registration_doc;
    if (documents.proof_of_address_doc) {
      business.proof_of_address_doc = documents.proof_of_address_doc;
    }
    business.registration_status = documents.registration_status;

    const updatedBusiness = await this.businessRepository.save(business);

    if (business.registration_status === 'documents_completed') {
      await this.graphService.completeKyb(updatedBusiness);
    }

    return await this.businessRepository.save(business);
  }

  async findAll(page: number, limit: number) {
    try {
      const [businesses, total] = await this.businessRepository.findAndCount({
        skip: (page - 1) * limit,
        take: limit,
        order: { dateCreated: 'DESC' },
      });

      if (!businesses.length && page > 1) {
        throw new HttpException(
          {
            message: 'Page not found',
            errors: ['The requested page exceeds available results'],
          },
          HttpStatus.NOT_FOUND,
        );
      }

      return {
        data: businesses,
        meta: {
          total,
          page,
          limit,
          totalPages: Math.ceil(total / limit),
        },
      };
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }

      throw new HttpException(
        {
          message: 'Failed to fetch businesses',
          errors: [error.message],
        },
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
        throw new HttpException(
          {
            message: 'Business not found',
            errors: ['No business exists with this ID'],
          },
          HttpStatus.NOT_FOUND,
        );
      }

      return business;
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }

      throw new HttpException(
        {
          message: 'Failed to fetch business',
          errors: [error.message],
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async findByOwnerId(ownerId: string): Promise<Business[]> {
    try {
      const businesses = await this.businessRepository.find({
        where: { owner_id: ownerId },
        order: { dateCreated: 'DESC' },
      });

      return businesses;
    } catch (error) {
      throw new HttpException(
        {
          message: 'Failed to fetch owner businesses',
          errors: [error.message],
        },
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

      // Check if updating to a name that already exists (excluding current business)
      if (updateBusinessDto.basic_info?.name) {
        const existingBusiness = await this.businessRepository.findOne({
          where: [{ name: updateBusinessDto.basic_info?.name, id: Not(id) }],
        });

        if (existingBusiness) {
          throw new HttpException(
            {
              message: 'Business name already exists',
              errors: ['Another business is already using this name'],
            },
            HttpStatus.CONFLICT,
          );
        }
      }

      Object.assign(business, updateBusinessDto);
      return await this.businessRepository.save(business);
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }

      throw new HttpException(
        {
          message: 'Failed to update business',
          errors: [error.message],
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async remove(id: string): Promise<boolean> {
    try {
      const business = await this.findOne(id);
      await this.businessRepository.remove(business);
      return true;
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }

      throw new HttpException(
        {
          message: 'Failed to delete business',
          errors: [error.message],
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async initiateKYBVerification(id: string) {
    try {
      const business = await this.findOne(id);

      if (business.kyb_status === 'VERIFIED') {
        throw new HttpException(
          {
            message: 'Business already verified',
            errors: ['This business has already been verified'],
          },
          HttpStatus.BAD_REQUEST,
        );
      }

      // Implement your KYB verification logic here
      business.kyb_status = 'PENDING';
      return await this.businessRepository.save(business);
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }

      throw new HttpException(
        {
          message: 'Failed to initiate verification',
          errors: [error.message],
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async getKYBStatus(id: string) {
    try {
      const business = await this.findOne(id);
      return {
        businessId: business.id,
        status: business.kyb_status,
        updatedAt: business.dateUpdated,
      };
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }

      throw new HttpException(
        {
          message: 'Failed to fetch verification status',
          errors: [error.message],
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async uploadDocument(id: string, documentData: any) {
    try {
      const business = await this.findOne(id);

      // Implement document upload logic here
      // You might want to use your CloudinaryService here

      return {
        message: 'Document uploaded successfully',
        businessId: business.id,
      };
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }

      throw new HttpException(
        {
          message: 'Failed to upload document',
          errors: [error.message],
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async getDocuments(id: string) {
    try {
      const business = await this.findOne(id);

      // Implement document retrieval logic here
      return {
        businessId: business.id,
        documents: [], // Return actual documents
      };
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }

      throw new HttpException(
        {
          message: 'Failed to fetch documents',
          errors: [error.message],
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
