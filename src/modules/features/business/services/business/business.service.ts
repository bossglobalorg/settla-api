// src/business/services/business/business.service.ts
import { Not, Repository } from 'typeorm'

import { HttpException, HttpStatus, Injectable, NotFoundException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'

import { BusinessBasicInfoDto } from '@features/business/dto/basic-business.dto'
import { BusinessIdentificationDto } from '@features/business/dto/business-identification.dto'
import { CreateBusinessDto } from '@features/business/dto/create-business.dto'
import { UpdateBusinessDto } from '@features/business/dto/update-business.dto'
import { Business } from '@features/business/entities/business.entity'
import { User } from '@features/user/entities/user.entity'
import { PartnerEntityType, PartnerName } from '@global/enums/partner-reference.enum'
import { PartnerReferenceService } from '@global/services/partner-reference/partner-reference.service'
import { CloudinaryService } from '@providers/cloudinary/cloudinary.service'
import { GraphService } from '@providers/graph/graph.service'

export interface BusinessDocumentFiles {
  business_registration: Express.Multer.File[]
  proof_of_address: Express.Multer.File[]
}

export interface BusinessDocuments {
  business_registration_doc: string
  proof_of_address_doc?: string
  registration_status: string
}

@Injectable()
export class BusinessService {
  constructor(
    @InjectRepository(Business)
    private readonly businessRepository: Repository<Business>,
    private readonly graphService: GraphService,
    private readonly cloudinaryService: CloudinaryService,
    private readonly partnerService: PartnerReferenceService,
  ) {}

  async createBasicInfo(businessData: Partial<CreateBusinessDto>): Promise<Business> {
    const business = this.businessRepository.create(businessData)
    return await this.businessRepository.save(business)
  }

  async createBusinessWithBasicInfo(
    user: { id: string; businessName: string },
    basicInfoData: BusinessBasicInfoDto,
  ): Promise<{ data: Business; message: string }> {
    const existingBusiness = await this.findByOwnerId(user.id)
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
      user.id,
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
      ownerId: partnerReference.entityId,
      partnerEntityId: partnerReference.partnerEntityId,
      name: user.businessName,
      businessType: basicInfoData.businessType,
      industry: basicInfoData.industry,
      contactPhone: basicInfoData.contactPhone,
      contactEmail: basicInfoData.contactEmail,
      address: {
        line1: basicInfoData.line1,
        line2: basicInfoData.line2,
        city: basicInfoData.city,
        state: basicInfoData.state,
        country: basicInfoData.country,
        postalCode: basicInfoData.postalCode,
      },
      registrationStatus: 'basic_info_completed',
    }

    const savedBusiness = await this.createBasicInfo(businessData)
    return { data: savedBusiness, message: 'Business basic information created successfully' }
  }

  async addIdentification(
    businessId: string,
    identificationData: BusinessIdentificationDto,
  ): Promise<Business> {
    const business = await this.businessRepository.findOne({
      where: { id: businessId },
    })

    if (!business) {
      throw new NotFoundException('Business not found')
    }

    business.idType = identificationData.idType
    business.idNumber = identificationData.idNumber
    business.idCountry = identificationData.idCountry
    business.idLevel = identificationData.idLevel
    business.dof = identificationData.dof
    business.registrationStatus = 'identification_completed'

    return await this.businessRepository.save(business)
  }

  async updateBusinessIdentification(
    businessId: string,
    identificationData: BusinessIdentificationDto,
  ): Promise<{ data: Business; message: string }> {
    const formattedData = {
      ...identificationData,
      dof: new Date(identificationData.dof),
    }

    return {
      message: 'Business identification information created successfully',
      data: await this.addIdentification(businessId, formattedData),
    }
  }

  async processBusinessDocuments(
    businessId: string,
    files: BusinessDocumentFiles,
  ): Promise<Business> {
    try {
      this.validateDocumentFiles(files)
      const documentUrls = await this.uploadDocumentFiles(files)
      return await this.addDocuments(businessId, documentUrls)
    } catch (error) {
      this.handleDocumentProcessingError(error)
    }
  }

  private validateDocumentFiles(files: BusinessDocumentFiles): void {
    if (!files.business_registration || !files.business_registration[0]) {
      throw new HttpException(
        {
          message: 'Validation failed',
          errors: ['Business registration document is required'],
        },
        HttpStatus.BAD_REQUEST,
      )
    }
  }

  private async uploadDocumentFiles(files: BusinessDocumentFiles): Promise<BusinessDocuments> {
    const documents: BusinessDocuments = {
      business_registration_doc: '',
      proof_of_address_doc: '',
      registration_status: 'documents_completed',
    }

    // Upload business registration document
    const registrationUpload = await this.cloudinaryService.uploadDocument(
      files.business_registration[0],
    )
    documents.business_registration_doc = registrationUpload.secure_url

    // Upload proof of address if provided
    if (files.proof_of_address && files.proof_of_address[0]) {
      const addressUpload = await this.cloudinaryService.uploadDocument(files.proof_of_address[0])
      documents.proof_of_address_doc = addressUpload.secure_url
    }

    return documents
  }

  private handleDocumentProcessingError(error: any): never {
    if (error instanceof HttpException) {
      throw error
    }
    throw new HttpException(
      {
        message: 'Failed to upload business documents',
        errors: [error.message],
      },
      HttpStatus.INTERNAL_SERVER_ERROR,
    )
  }

  async addDocuments(
    businessId: string,
    documents: {
      business_registration_doc: string
      proof_of_address_doc?: string
      registration_status: string
    },
  ): Promise<Business> {
    const business = await this.businessRepository.findOne({
      where: { id: businessId },
      relations: ['owner'],
    })

    if (!business) {
      throw new NotFoundException('Business not found')
    }

    // Update document fields
    business.businessRegistrationDoc = documents.business_registration_doc

    if (documents.proof_of_address_doc) {
      business.proofOfAddressDoc = documents.proof_of_address_doc
    }

    business.registrationStatus = documents.registration_status

    const updatedBusiness = await this.businessRepository.save(business)

    if (business.registrationStatus === 'documents_completed') {
      await this.graphService.completeKyb(updatedBusiness)
    }

    return await this.businessRepository.save(business)
  }

  async findAll(page: number, limit: number) {
    try {
      const [businesses, total] = await this.businessRepository.findAndCount({
        skip: (page - 1) * limit,
        take: limit,
        order: { dateCreated: 'DESC' },
      })

      if (!businesses.length && page > 1) {
        throw new HttpException(
          {
            message: 'Page not found',
            errors: ['The requested page exceeds available results'],
          },
          HttpStatus.NOT_FOUND,
        )
      }

      return {
        data: businesses,
        meta: {
          total,
          page,
          limit,
          totalPages: Math.ceil(total / limit),
        },
      }
    } catch (error) {
      if (error instanceof HttpException) {
        throw error
      }

      throw new HttpException(
        {
          message: 'Failed to fetch businesses',
          errors: [error.message],
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      )
    }
  }

  async findOne(id: string): Promise<Business> {
    try {
      const business = await this.businessRepository.findOne({
        where: { id },
      })

      if (!business) {
        throw new HttpException(
          {
            message: 'Business not found',
            errors: ['No business exists with this ID'],
          },
          HttpStatus.NOT_FOUND,
        )
      }

      return business
    } catch (error) {
      if (error instanceof HttpException) {
        throw error
      }

      throw new HttpException(
        {
          message: 'Failed to fetch business',
          errors: [error.message],
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      )
    }
  }

  // business.service.ts

  async findByOwnerId(userId: string): Promise<Business[]> {
    try {
      const businesses = await this.businessRepository.find({
        where: { ownerId: userId },
        order: { dateCreated: 'DESC' },
      })

      return businesses
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error
      }

      throw new HttpException(
        {
          message: 'Failed to fetch owner businesses',
          errors: [error.message],
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      )
    }
  }

  async update(id: string, updateBusinessDto: UpdateBusinessDto): Promise<Business> {
    try {
      const business = await this.findOne(id)

      // Check if updating to a name that already exists (excluding current business)
      if (updateBusinessDto.basic_info?.name) {
        const existingBusiness = await this.businessRepository.findOne({
          where: [{ name: updateBusinessDto.basic_info?.name, id: Not(id) }],
        })

        if (existingBusiness) {
          throw new HttpException(
            {
              message: 'Business name already exists',
              errors: ['Another business is already using this name'],
            },
            HttpStatus.CONFLICT,
          )
        }
      }

      Object.assign(business, updateBusinessDto)
      return await this.businessRepository.save(business)
    } catch (error) {
      if (error instanceof HttpException) {
        throw error
      }

      throw new HttpException(
        {
          message: 'Failed to update business',
          errors: [error.message],
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      )
    }
  }

  async remove(id: string): Promise<boolean> {
    try {
      const business = await this.findOne(id)
      await this.businessRepository.remove(business)
      return true
    } catch (error) {
      if (error instanceof HttpException) {
        throw error
      }

      throw new HttpException(
        {
          message: 'Failed to delete business',
          errors: [error.message],
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      )
    }
  }

  async initiateKYBVerification(id: string) {
    try {
      const business = await this.findOne(id)

      if (business.kybStatus === 'VERIFIED') {
        throw new HttpException(
          {
            message: 'Business already verified',
            errors: ['This business has already been verified'],
          },
          HttpStatus.BAD_REQUEST,
        )
      }

      // Implement your KYB verification logic here
      business.kybStatus = 'PENDING'
      return await this.businessRepository.save(business)
    } catch (error) {
      if (error instanceof HttpException) {
        throw error
      }

      throw new HttpException(
        {
          message: 'Failed to initiate verification',
          errors: [error.message],
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      )
    }
  }

  async getKYBStatus(id: string) {
    try {
      const business = await this.findOne(id)
      return {
        businessId: business.id,
        status: business.kybStatus,
        updatedAt: business.dateUpdated,
      }
    } catch (error) {
      if (error instanceof HttpException) {
        throw error
      }

      throw new HttpException(
        {
          message: 'Failed to fetch verification status',
          errors: [error.message],
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      )
    }
  }

  async uploadDocument(id: string, documentData: any) {
    try {
      const business = await this.findOne(id)

      return {
        message: 'Document uploaded successfully',
        businessId: business.id,
      }
    } catch (error) {
      if (error instanceof HttpException) {
        throw error
      }

      throw new HttpException(
        {
          message: 'Failed to upload document',
          errors: [error.message],
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      )
    }
  }

  async getDocuments(id: string) {
    try {
      const business = await this.findOne(id)

      // Implement document retrieval logic here
      return {
        businessId: business.id,
        documents: [], // Return actual documents
      }
    } catch (error) {
      if (error instanceof HttpException) {
        throw error
      }

      throw new HttpException(
        {
          message: 'Failed to fetch documents',
          errors: [error.message],
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      )
    }
  }
}
