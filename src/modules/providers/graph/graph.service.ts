import { PartnerEntityType, PartnerName } from 'src/global/enums/partner-reference.enum'
import { GraphConfig } from 'src/services/app-config/configuration'
import { Repository } from 'typeorm'

import { HttpService } from '@nestjs/axios'
import { Injectable, Logger } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { InjectRepository } from '@nestjs/typeorm'

import { Business } from '@features/business/entities/business.entity'
import { User } from '@features/user/entities/user.entity'

import { PartnerReferenceService } from '../../../global/services/partner-reference/partner-reference.service'
import { CreatePayoutDestinationDto } from './dto/create-payout-destination.dto'
import { CreatePayoutDto } from './dto/create-payout.dto'
import { FetchBankAccountsResponseDto } from './dto/fetch-bank-accounts.dto'
import {
  FetchPayoutDestinationsResponseDto,
  PayoutDestinationDto,
} from './dto/fetch-payout-destinations.dto'
import { GraphUtils } from './graph.utils'

type BusinessType = 'soleProprietor' | 'singleMemberLLC' | 'limitedLiabilityCompany'
type GraphBusinessType = 'soleProprietor' | 'singleMemberLLC' | 'limitedLiabilityCompany'

@Injectable()
export class GraphService {
  private readonly logger = new Logger(GraphService.name)

  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
    private readonly graphUtils: GraphUtils,
    @InjectRepository(Business)
    private readonly businessRepository: Repository<Business>,
    private readonly partnerReferenceService: PartnerReferenceService,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async completeKyb(business: Business): Promise<void> {
    const { baseUrl, apiKey } = this.configService.get<GraphConfig>('graph') as GraphConfig

    const formattedData = {
      owner_id: business.partnerEntityId,
      name: business.name,
      business_type: this.formatBusinessType(business.businessType as BusinessType),
      industry: business.industry,
      id_type: business.idType,
      id_number: business.idNumber,
      id_country: business.idCountry,
      id_upload: business.businessRegistrationDoc,
      id_level: business.idLevel,
      dof: business.dof,
      contact_phone: business.contactPhone,
      contact_email: business.contactEmail,
      address: {
        line1: business.address.line1,
        line2: business.address.line2 || null,
        city: business.address.city,
        state: business.address.state,
        country: business.address.country,
        postal_code: business.address.postalCode,
      },
      proof_of_address: business.proofOfAddressDoc || null,
    }

    try {
      const response = await this.httpService.axiosRef.post(`${baseUrl}/business`, formattedData, {
        headers: {
          Authorization: `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
          'X-Source': 'settla',
        },
      })

      business.kybStatus = response.data.data.kyb_status
      business.kybResponse = response.data.data

      await this.businessRepository.save(business)

      await this.partnerReferenceService.createOrUpdate({
        entityId: business.id,
        entityType: PartnerEntityType.BUSINESS,
        partnerName: PartnerName.GRAPH,
        partnerEntityId: response.data.data.id,
        metadata: response.data,
        verificationStatus: response.data.data.kyb_status,
      })

      this.logger.log(
        `Successfully sent KYB data to Graph for business ${business.id}. Status: ${response.status}`,
      )
    } catch (error) {
      this.logger.error(
        `Failed to send KYB data to Graph for business ${business.id}`,
        error.response?.data || error.message,
      )
      throw error
    }
  }

  async verifyUserKyc(user: User): Promise<any> {
    const { baseUrl, apiKey } = this.configService.get<GraphConfig>('graph') as GraphConfig

    const backgroundInformationSnakeCase = user.backgroundInformation
      ? {
          employment_status: user.backgroundInformation.employmentStatus,
          occupation: user.backgroundInformation.occupation,
          primary_purpose: user.backgroundInformation.primaryPurpose,
          source_of_funds: user.backgroundInformation.sourceOfFunds,
          expected_monthly_inflow: user.backgroundInformation.expectedMonthly,
        }
      : {}

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
      background_information: backgroundInformationSnakeCase,
    }

    try {
      const response = await this.httpService.axiosRef.post(`${baseUrl}/person`, formattedData, {
        headers: {
          Authorization: `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
          'X-Source': 'settla',
        },
      })

      user.kycStatus = response.data.data.kyc_status
      user.kycResponse = response.data.data

      await this.userRepository.save(user)

      await this.partnerReferenceService.createOrUpdate({
        entityId: user.id,
        entityType: PartnerEntityType.USER,
        partnerName: PartnerName.GRAPH,
        partnerEntityId: response.data.data.id,
        metadata: response.data,
        verificationStatus: response.data.data.kyc_status,
      })

      return response.data.data
    } catch (error) {
      this.logger.error(
        `Failed to verify KYC with Graph for user ${user.id}`,
        error.response?.data || error.message,
      )
      throw error
    }
  }

  private formatBusinessType(type: BusinessType): GraphBusinessType {
    const typeMapping: Record<BusinessType, GraphBusinessType> = {
      soleProprietor: 'soleProprietor',
      singleMemberLLC: 'singleMemberLLC',
      limitedLiabilityCompany: 'limitedLiabilityCompany',
    }

    return typeMapping[type] || type
  }

  // payouts
  async createPayoutDestination(
    payoutDestination: CreatePayoutDestinationDto,
  ): Promise<PayoutDestinationDto> {
    const { baseUrl, apiKey } = this.configService.get<GraphConfig>('graph') as GraphConfig

    const response = await this.httpService.axiosRef.post(
      `${baseUrl}/payout-destination`,
      payoutDestination,
    )

    return response.data.data
  }

  async listPayoutDestinations(): Promise<FetchPayoutDestinationsResponseDto> {
    const { baseUrl, apiKey } = this.configService.get<GraphConfig>('graph') as GraphConfig

    const response = await this.httpService.axiosRef.get(`${baseUrl}/payout-destination`, {
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
        'X-Source': 'settla',
      },
    })

    return response.data.data
  }

  async getPayoutDestination(id: string): Promise<PayoutDestinationDto> {
    const { baseUrl, apiKey } = this.configService.get<GraphConfig>('graph') as GraphConfig

    const response = await this.httpService.axiosRef.get(`${baseUrl}/payout-destination/${id}`, {
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
        'X-Source': 'settla',
      },
    })

    return response.data.data
  }

  async createPayout(payout: CreatePayoutDto): Promise<any> {
    const { baseUrl, apiKey } = this.configService.get<GraphConfig>('graph') as GraphConfig

    const response = await this.httpService.axiosRef.post(`${baseUrl}/payout`, payout, {
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
        'X-Source': 'settla',
      },
    })

    return response.data.data
  }

  async listPayouts(): Promise<any> {
    const { baseUrl, apiKey } = this.configService.get<GraphConfig>('graph') as GraphConfig

    const response = await this.httpService.axiosRef.get(`${baseUrl}/payout`, {
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
        'X-Source': 'settla',
      },
    })

    return response.data.data
  }

  async getPayout(id: string): Promise<any> {
    const { baseUrl, apiKey } = this.configService.get<GraphConfig>('graph') as GraphConfig

    const response = await this.httpService.axiosRef.get(`${baseUrl}/payout/${id}`, {
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
        'X-Source': 'settla',
      },
    })

    return response.data.data
  }

  async listWallets(): Promise<any> {
    const { baseUrl, apiKey } = this.configService.get<GraphConfig>('graph') as GraphConfig

    const response = await this.httpService.axiosRef.get(`${baseUrl}/wallet_account`, {
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
        'X-Source': 'settla',
      },
    })

    return response.data.data
  }

  async listBankAccounts(): Promise<FetchBankAccountsResponseDto> {
    const { baseUrl, apiKey } = this.configService.get<GraphConfig>('graph') as GraphConfig

    const response = await this.httpService.axiosRef.get(`${baseUrl}/bank_account`, {
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
        'X-Source': 'settla',
      },
    })

    return response.data
  }

  async createBankAccount(payload: Record<string, unknown>): Promise<any> {
    const { baseUrl, apiKey } = this.configService.get<GraphConfig>('graph') as GraphConfig

    try {
      const response = await this.httpService.axiosRef.post(`${baseUrl}/bank_account`, payload, {
        headers: {
          Authorization: `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
          'X-Source': 'settla',
        },
      })

      return response.data.data
    } catch (error) {
      console.log(payload)

      this.logger.error(
        `Failed to create bank account with Graph for user`,
        error.response?.data || error.message,
      )
      throw error
    }
  }
}
