import { Not, Repository } from 'typeorm'

import { ConflictException, Injectable, NotFoundException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'

import { BackgroundInfoDto } from '@features/user/dto/kyc/background-info.dto'
import { DocumentDto } from '@features/user/dto/kyc/document.dto'
import { IdentificationDto } from '@features/user/dto/kyc/identification.dto'
import { PersonalInfoDto } from '@features/user/dto/kyc/personal-info.dto'
import { GraphService } from '@providers/graph/graph.service'

import { User } from '../../entities/user.entity'

@Injectable()
export class UserKycService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly graphService: GraphService,
  ) {}

  async savePersonalInfo(userId: string, data: PersonalInfoDto): Promise<User> {
    const user = await this.findUser(userId)

    const existingUserWithPhone = await this.userRepository.findOne({
      where: {
        phone: data.phone,
        id: Not(userId),
      },
    })

    if (existingUserWithPhone) {
      throw new ConflictException('Phone number is already in use by another user')
    }
    Object.assign(user, data)
    user.kycStep = 'personal_info'
    return await this.userRepository.save(user)
  }

  async saveIdentification(userId: string, data: IdentificationDto): Promise<User> {
    const user = await this.findUser(userId)
    const existingUser = await this.userRepository.findOne({
      where: [
        {
          bankIdNumber: data.bankIdNumber,
          id: Not(userId),
        },
        {
          idNumber: data.idNumber,
          id: Not(userId),
        },
      ],
    })

    if (existingUser) {
      if (existingUser.bankIdNumber === data.bankIdNumber) {
        throw new ConflictException('Bank ID number is already in use by another user')
      } else {
        throw new ConflictException('ID number is already in use by another user')
      }
    }

    Object.assign(user, data)
    user.kycStep = 'identification'
    return await this.userRepository.save(user)
  }

  async saveBackgroundInfo(userId: string, data: BackgroundInfoDto): Promise<User> {
    const user = await this.findUser(userId)
    Object.assign(user, {
      background_information: data,
    })
    user.kycStep = 'background'
    return await this.userRepository.save(user)
  }

  async addDocument(userId: string, document: DocumentDto): Promise<User> {
    const user = await this.findUser(userId)

    if (!user.documents) {
      user.documents = []
    }

    user.documents.push(document)
    user.kycStep = 'documents'

    const updatedUser = await this.userRepository.save(user)
    if (this.isKycComplete(updatedUser)) {
      try {
        const verificationResult = await this.graphService.verifyUserKyc(updatedUser)
        if (verificationResult?.kyc_status === 'verified') {
          user.kycStatus = 'completed'
          user.kycStep = 'completed'
          return await this.userRepository.save(user)
        }

        throw new Error('KYC verification response was not successful')
      } catch (error) {
        throw error
      }
    }
    return updatedUser
  }

  private async findUser(userId: string): Promise<User> {
    const user = await this.userRepository.findOne({ where: { id: userId } })
    if (!user) {
      throw new NotFoundException('User not found')
    }
    return user
  }

  private isKycComplete(user: User): boolean {
    return user.documents && user.documents.length >= 1
  }
}
