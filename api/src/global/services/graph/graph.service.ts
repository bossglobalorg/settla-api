// src/business/services/graph.service.ts
import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { HttpService } from '@nestjs/axios';
import { Business } from 'src/business/entities/business.entity';
import { GraphConfig } from 'src/services/app-config/configuration';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PartnerReferenceService } from '../partner-reference/partner-reference.service';
import {
  PartnerEntityType,
  PartnerName,
} from 'src/global/enums/partner-reference.enum';
import { UserEntity } from 'src/user/entities/user.entity';

type BusinessType =
  | 'soleProprietor'
  | 'singleMemberLLC'
  | 'limitedLiabilityCompany';
type GraphBusinessType =
  | 'soleProprietor'
  | 'singleMemberLLC'
  | 'limitedLiabilityCompany';

@Injectable()
export class GraphService {
  private readonly logger = new Logger(GraphService.name);

  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
    @InjectRepository(Business)
    private readonly businessRepository: Repository<Business>,
    private readonly partnerReferenceService: PartnerReferenceService,
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {}

  async completeKyb(business: Business): Promise<void> {
    const { baseUrl, apiKey } = this.configService.get<GraphConfig>(
      'graph',
    ) as GraphConfig;

    const formattedData = {
      owner_id: business.owner_id,
      name: business.name,
      business_type: this.formatBusinessType(
        business.business_type as BusinessType,
      ),
      industry: business.industry,
      id_type: business.id_type,
      id_number: business.id_number,
      id_country: business.id_country,
      id_upload: business.business_registration_doc,
      id_level: business.id_level,
      dof: business.dof,
      contact_phone: business.contact_phone,
      contact_email: business.contact_email,
      address: {
        line1: business.address.line1,
        line2: business.address.line2 || null,
        city: business.address.city,
        state: business.address.state,
        country: business.address.country,
        postal_code: business.address.postal_code,
      },
      proof_of_address: business.proof_of_address_doc || null,
    };

    try {
      const response = await this.httpService.axiosRef.post(
        `${baseUrl}/business`,
        formattedData,
        {
          headers: {
            Authorization: `Bearer ${apiKey}`,
            'Content-Type': 'application/json',
            'X-Source': 'settla',
          },
        },
      );

      business.kyb_status = response.data.data.kyb_status;
      business.kyb_response = response.data.data;

      await this.businessRepository.save(business);

      await this.partnerReferenceService.createOrUpdate({
        entityId: business.id,
        entityType: PartnerEntityType.BUSINESS,
        partnerName: PartnerName.GRAPH,
        partnerEntityId: response.data.data.id,
        metadata: response.data,
        verificationStatus: response.data.data.kyb_status,
      });

      this.logger.log(
        `Successfully sent KYB data to Graph for business ${business.id}. Status: ${response.status}`,
      );
    } catch (error) {
      this.logger.error(
        `Failed to send KYB data to Graph for business ${business.id}`,
        error.response?.data || error.message,
      );
      throw error;
    }
  }

  // src/global/services/graph/graph.service.ts
  async verifyUserKyc(user: UserEntity): Promise<any> {
    const { baseUrl, apiKey } = this.configService.get<GraphConfig>(
      'graph',
    ) as GraphConfig;

    const formattedData = {
      name_first: user.firstName,
      name_last: user.lastName,
      name_other: user.otherName || '',
      phone: user.phone,
      email: user.email,
      dob: user.dob,
      id_level: user.idLevel,
      id_type: user.idType,
      id_number: user.idNumber,
      id_country: user.idCountry,
      bank_id_number: user.bankIdNumber,
      kyc_level: user.kycLevel || 'basic',
      address: user.address || {},
      background_information: user.background_information || {},
      documents: user.documents || [],
    };

    try {
      const response = await this.httpService.axiosRef.post(
        `${baseUrl}/person`,
        formattedData,
        {
          headers: {
            Authorization: `Bearer ${apiKey}`,
            'Content-Type': 'application/json',
            'X-Source': 'settla',
          },
        },
      );

      user.kyc_status = response.data.data.kyc_status;
      user.kyc_response = response.data.data;

      await this.userRepository.save(user);

      await this.partnerReferenceService.createOrUpdate({
        entityId: user.id,
        entityType: PartnerEntityType.USER,
        partnerName: PartnerName.GRAPH,
        partnerEntityId: response.data.data.id,
        metadata: response.data,
        verificationStatus: response.data.data.kyc_status,
      });

      return response.data;
    } catch (error) {
      this.logger.error(
        `Failed to verify KYC with Graph for user ${user.id}`,
        error.response?.data || error.message,
      );
      throw error;
    }
  }

  private formatBusinessType(type: BusinessType): GraphBusinessType {
    const typeMapping: Record<BusinessType, GraphBusinessType> = {
      soleProprietor: 'soleProprietor',
      singleMemberLLC: 'singleMemberLLC',
      limitedLiabilityCompany: 'limitedLiabilityCompany',
    };

    return typeMapping[type] || type;
  }
}
