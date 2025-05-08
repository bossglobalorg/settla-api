import { Repository } from 'typeorm'

import { Injectable, NotFoundException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'

import { User } from '@features/user/entities/user.entity'
import { GraphService } from '@providers/graph/graph.service'

import { CreateKycDocumentDto } from './dto/create-kyc-document.dto'
import { KycDocument, KycDocumentStatus, KycDocumentType } from './entities/kyc-document.entity'

@Injectable()
export class KycDocumentService {
  constructor(
    @InjectRepository(KycDocument)
    private readonly kycDocumentRepository: Repository<KycDocument>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async create(userId: string, createKycDocumentDto: CreateKycDocumentDto): Promise<KycDocument> {
    const user = await this.userRepository.findOne({ where: { id: userId } })
    if (!user) {
      throw new NotFoundException('User not found')
    }

    if (!user.documents) {
      user.documents = []
    }

    user.documents.push(createKycDocumentDto)
    user.kycStep = 'documents'

    console.log({ createKycDocumentDto })

    const kycDocument = this.kycDocumentRepository.create({
      userId,
      type: createKycDocumentDto.type as KycDocumentType,
      documentUrl: createKycDocumentDto.documentUrl,
      status: KycDocumentStatus.PENDING,
      issueDate: createKycDocumentDto.issueDate,
      expiryDate: createKycDocumentDto.expiryDate,
    })

    const savedDocument = await this.kycDocumentRepository.save(kycDocument)

    return savedDocument
  }

  async findAllByUser(userId: string): Promise<KycDocument[]> {
    return this.kycDocumentRepository.find({
      where: { userId },
      order: { uploadedAt: 'DESC' },
    })
  }

  async findOne(id: string): Promise<KycDocument> {
    const document = await this.kycDocumentRepository.findOne({
      where: { id },
    })

    if (!document) {
      throw new NotFoundException('Document not found')
    }

    return document
  }

  async updateStatus(id: string, status: KycDocumentStatus): Promise<KycDocument> {
    const document = await this.findOne(id)

    document.status = status

    if (status === KycDocumentStatus.APPROVED || status === KycDocumentStatus.REJECTED) {
      document.verifiedAt = new Date()
    }

    return this.kycDocumentRepository.save(document)
  }

  async remove(id: string): Promise<void> {
    const document = await this.findOne(id)
    await this.kycDocumentRepository.remove(document)
  }
}
