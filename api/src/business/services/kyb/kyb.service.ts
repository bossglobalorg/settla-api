// src/services/kyc.service.ts
import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class KybService {
  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {}

  async verifyBusiness(businessData: any) {
    try {
      // Call third-party API for business verification
      const response = await this.httpService
        .post(`${this.configService.get('KYB_API_URL')}/verify`, businessData, {
          headers: {
            Authorization: `Bearer ${this.configService.get('KYB_API_KEY')}`,
          },
        })
        .toPromise();

      return response?.data;
    } catch (error) {
      throw new Error(`Business verification failed: ${error.message}`);
    }
  }

  async verifyIndividual(userData: any) {
    try {
      // Call third-party API for individual verification
      const response = await this.httpService
        .post(`${this.configService.get('KYC_API_URL')}/verify`, userData, {
          headers: {
            Authorization: `Bearer ${this.configService.get('KYC_API_KEY')}`,
          },
        })
        .toPromise();

      return response?.data;
    } catch (error) {
      throw new Error(`Individual verification failed: ${error.message}`);
    }
  }
}
