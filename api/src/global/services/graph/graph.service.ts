// src/business/services/graph.service.ts
import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { HttpService } from '@nestjs/axios';
import { Business } from 'src/business/entities/business.entity';
import { GraphConfig } from 'src/services/app-config/configuration';

type BusinessType =
  | 'soleProprietor'
  | 'singleMemberLLC'
  | 'limitedLiabilityCompany';
type GraphBusinessType = 'soleProprietor' | 'singleMemberLLC' | 'limitedLiabilityCompany';

@Injectable()
export class GraphService {
  private readonly logger = new Logger(GraphService.name);

  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
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

    console.log({ formattedData });

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

  private formatBusinessType(type: BusinessType): GraphBusinessType {
    const typeMapping: Record<BusinessType, GraphBusinessType> = {
      soleProprietor: 'soleProprietor',
      singleMemberLLC: 'singleMemberLLC',
      limitedLiabilityCompany: 'limitedLiabilityCompany',
    };

    return typeMapping[type] || type;
  }
}
