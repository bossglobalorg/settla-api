// src/common/services/partner-reference.service.ts
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PartnerReference } from '../../entities/partner-reference.entity';
import {
  PartnerEntityType,
  PartnerName,
} from '../../enums/partner-reference.enum';

interface CreatePartnerReferenceDto {
  entityId: string;
  entityType: PartnerEntityType;
  partnerName: PartnerName;
  partnerEntityId: string;
  metadata?: Record<string, any>;
  verificationStatus?: string;
}

@Injectable()
export class PartnerReferenceService {
  constructor(
    @InjectRepository(PartnerReference)
    private readonly partnerReferenceRepository: Repository<PartnerReference>,
  ) {}

  async createOrUpdate(
    data: CreatePartnerReferenceDto,
  ): Promise<PartnerReference> {
    const existingReference = await this.partnerReferenceRepository.findOne({
      where: {
        entity_id: data.entityId,
        entity_type: data.entityType,
        partner_name: data.partnerName,
      },
    });

    if (existingReference) {
      return this.partnerReferenceRepository.save({
        ...existingReference,
        partner_entity_id: data.partnerEntityId,
        metadata: data.metadata,
        verification_status: data.verificationStatus,
      });
    }

    const reference = this.partnerReferenceRepository.create({
      entity_id: data.entityId,
      entity_type: data.entityType,
      partner_name: data.partnerName,
      partner_entity_id: data.partnerEntityId,
      metadata: data.metadata,
      verification_status: data.verificationStatus,
    });

    return await this.partnerReferenceRepository.save(reference);
  }

  async findReference(
    entityId: string,
    entityType: PartnerEntityType,
    partnerName: PartnerName,
  ): Promise<PartnerReference | null> {
    return await this.partnerReferenceRepository.findOne({
      where: {
        entity_id: entityId,
        entity_type: entityType,
        partner_name: partnerName,
      },
    });
  }

  async findAllEntityReferences(
    entityId: string,
    entityType: PartnerEntityType,
  ): Promise<PartnerReference[]> {
    return await this.partnerReferenceRepository.find({
      where: {
        entity_id: entityId,
        entity_type: entityType,
      },
    });
  }
}
