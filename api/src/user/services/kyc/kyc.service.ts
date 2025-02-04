// src/user/services/user-kyc.service.ts
import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserEntity } from '../../entities/user.entity';

import { GraphService } from 'src/global/services/graph/graph.service';
import {
  PartnerEntityType,
  PartnerName,
} from 'src/global/enums/partner-reference.enum';
import { UserKycDto } from 'src/user/dto/kyc.dto';
import { PartnerReferenceService } from 'src/global/services/partner-reference/partner-reference.service';
import { PersonalInfoDto } from 'src/user/dto/kyc/personal-info.dto';
import { IdentificationDto } from 'src/user/dto/kyc/identification.dto';
import { BackgroundInfoDto } from 'src/user/dto/kyc/background-info.dto';
import { DocumentDto } from 'src/user/dto/kyc/document.dto';

@Injectable()
export class UserKycService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    private readonly graphService: GraphService,
  ) {}

  async savePersonalInfo(
    userId: string,
    data: PersonalInfoDto,
  ): Promise<UserEntity> {
    const user = await this.findUser(userId);
    Object.assign(user, data);
    user.kyc_status = 'personal_info';
    return await this.userRepository.save(user);
  }

  async saveIdentification(
    userId: string,
    data: IdentificationDto,
  ): Promise<UserEntity> {
    const user = await this.findUser(userId);
    Object.assign(user, data);
    user.kyc_status = 'identification';
    return await this.userRepository.save(user);
  }

  async saveBackgroundInfo(
    userId: string,
    data: BackgroundInfoDto,
  ): Promise<UserEntity> {
    const user = await this.findUser(userId);
    Object.assign(user, {
      background_information: data,
    });
    user.kyc_status = 'background';
    return await this.userRepository.save(user);
  }

  async addDocument(
    userId: string,
    document: DocumentDto,
  ): Promise<UserEntity> {
    const user = await this.findUser(userId);

    if (!user.documents) {
      user.documents = [];
    }

    user.documents.push(document);
    user.kyc_status = 'documents';

    const updatedUser = await this.userRepository.save(user);

    // If all required documents are uploaded, send to Graph
    if (this.isKycComplete(updatedUser)) {
      await this.graphService.verifyUserKyc(updatedUser);
      user.kyc_status = 'completed';
      return await this.userRepository.save(user);
    }

    return updatedUser;
  }

  private async findUser(userId: string): Promise<UserEntity> {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }

  private isKycComplete(user: UserEntity): boolean {
    return user.documents && user.documents.length >= 1; // Adjust based on your requirements
  }
}
