import { Injectable, NotFoundException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { UserEntity } from '../../entities/user.entity'
import { GraphService } from '@providers/graph/graph.service'
import { PersonalInfoDto } from '@features/user/dto/kyc/personal-info.dto'
import { IdentificationDto } from '@features/user/dto/kyc/identification.dto'
import { BackgroundInfoDto } from '@features/user/dto/kyc/background-info.dto'
import { DocumentDto } from '@features/user/dto/kyc/document.dto'

@Injectable()
export class UserKycService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    private readonly graphService: GraphService
  ) {}

  async savePersonalInfo(
    userId: string,
    data: PersonalInfoDto
  ): Promise<UserEntity> {
    const user = await this.findUser(userId)
    Object.assign(user, data)
    user.kyc_step = 'personal_info'
    return await this.userRepository.save(user)
  }

  async saveIdentification(
    userId: string,
    data: IdentificationDto
  ): Promise<UserEntity> {
    const user = await this.findUser(userId)
    Object.assign(user, data)
    user.kyc_step = 'identification'
    return await this.userRepository.save(user)
  }

  async saveBackgroundInfo(
    userId: string,
    data: BackgroundInfoDto
  ): Promise<UserEntity> {
    const user = await this.findUser(userId)
    Object.assign(user, {
      background_information: data,
    })
    user.kyc_step = 'background'
    return await this.userRepository.save(user)
  }

  async addDocument(
    userId: string,
    document: DocumentDto
  ): Promise<UserEntity> {
    const user = await this.findUser(userId)

    if (!user.documents) {
      user.documents = []
    }

    user.documents.push(document)
    user.kyc_step = 'documents'

    const updatedUser = await this.userRepository.save(user)

    if (this.isKycComplete(updatedUser)) {
      try {
        const verificationResult =
          await this.graphService.verifyUserKyc(updatedUser)
        if (verificationResult?.kyc_status === 'verified') {
          user.kyc_status = 'completed'
          user.kyc_step = 'completed'
          return await this.userRepository.save(user)
        }

        throw new Error('KYC verification response was not successful')
      } catch (error) {
        throw error
      }
    }
    return updatedUser
  }

  private async findUser(userId: string): Promise<UserEntity> {
    const user = await this.userRepository.findOne({ where: { id: userId } })
    if (!user) {
      throw new NotFoundException('User not found')
    }
    return user
  }

  private isKycComplete(user: UserEntity): boolean {
    return user.documents && user.documents.length >= 1 // Adjust based on your requirements
  }
}
