// src/common/services/partner-reference.service.ts
import { Repository } from 'typeorm'

import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'

import { Business } from '@features/business/entities/business.entity'
import { User } from '@features/user/entities/user.entity'

import { PartnerReference } from '../../entities/partner-reference.entity'
import { PartnerEntityType, PartnerName } from '../../enums/partner-reference.enum'

interface CreatePartnerReferenceDto {
  entityId: string
  entityType: PartnerEntityType
  partnerName: PartnerName
  partnerEntityId: string
  metadata?: Record<string, any>
  verificationStatus?: string
}

@Injectable()
export class PartnerReferenceService {
  constructor(
    @InjectRepository(PartnerReference)
    private readonly partnerReferenceRepository: Repository<PartnerReference>,
    @InjectRepository(User)
    private readonly userRepository: Repository<PartnerReference>,
    @InjectRepository(Business)
    private readonly businessRepository: Repository<Business>,
  ) {}

  async createOrUpdate(data: CreatePartnerReferenceDto): Promise<PartnerReference> {
    if (data.entityType === PartnerEntityType.USER) {
      const userExists = await this.userRepository.findOne({
        where: { id: data.entityId },
      })

      if (!userExists) {
        throw new NotFoundException(`User with ID ${data.entityId} not found`)
      }
    } else if (data.entityType === PartnerEntityType.BUSINESS) {
      const businessExists = await this.businessRepository.findOne({
        where: { id: data.entityId },
      })

      if (!businessExists) {
        throw new NotFoundException(`Business with ID ${data.entityId} not found`)
      }
    }

    const existingReference = await this.partnerReferenceRepository.findOne({
      where: {
        entityId: data.entityId,
        entityType: data.entityType,
        partnerName: data.partnerName,
      },
    })

    if (existingReference) {
      return this.partnerReferenceRepository.save({
        ...existingReference,
        partnerEntityId: data.partnerEntityId,
        metadata: data.metadata,
        verificationStatus: data.verificationStatus,
      })
    }

    const reference = this.partnerReferenceRepository.create({
      entityId: data.entityId,
      entityType: data.entityType,
      partnerName: data.partnerName,
      partnerEntityId: data.partnerEntityId,
      metadata: data.metadata,
      verificationStatus: data.verificationStatus,
    })

    return await this.partnerReferenceRepository.save(reference)
  }

  async findReference(
    entityId: string,
    entityType: PartnerEntityType,
    partnerName: PartnerName,
  ): Promise<PartnerReference | null> {
    return await this.partnerReferenceRepository.findOne({
      where: {
        entityId: entityId,
        entityType: entityType,
        partnerName: partnerName,
      },
    })
  }

  async findAllEntityReferences(
    entityId: string,
    entityType: PartnerEntityType,
  ): Promise<PartnerReference[]> {
    return await this.partnerReferenceRepository.find({
      where: {
        entityId: entityId,
        entityType: entityType,
      },
    })
  }
}
