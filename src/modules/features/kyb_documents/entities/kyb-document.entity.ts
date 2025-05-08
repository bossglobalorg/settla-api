import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm'

import { User } from '@features/user/entities/user.entity'
import { BaseEntity } from '@global/entities/base.entity'

import { Business } from '../../business/entities/business.entity'

export enum KybDocumentType {
  TAX_ID = 'tax_id',
  LICENSE = 'license',
  CERTIFICATE_OF_INCORPORATION = 'certificate_of_incorporation',
  CAC = 'cac',
  EIN = 'ein',
  BUSINESS_REGISTRATION = 'business_registration',
  BUSINESS_LICENSE = 'business_license',
  OPERATING_LICENSE = 'operating_license',
  TRADE_LICENSE = 'trade_license',
  TIN = 'tin',
  VAT = 'vat',

  // Regulatory documents
  REGULATORY_APPROVAL = 'regulatory_approval',
  INDUSTRY_CERTIFICATION = 'industry_certification',

  // Financial documents
  FINANCIAL_STATEMENT = 'financial_statement',
  BANK_STATEMENT = 'bank_statement',

  // Compliance documents
  AML_POLICY = 'aml_policy', // Anti-Money Laundering policy
  KYC_POLICY = 'kyc_policy', // Know Your Customer policy

  // Other common documents
  PROOF_OF_ADDRESS = 'proof_of_address',
  MEMORANDUM_OF_ASSOCIATION = 'memorandum_of_association',
  ARTICLES_OF_ASSOCIATION = 'articles_of_association',
  BOARD_RESOLUTION = 'board_resolution',
  SHAREHOLDING_STRUCTURE = 'shareholding_structure',
}

export enum KybDocumentStatus {
  PENDING = 'pending',
  APPROVED = 'approved',
  REJECTED = 'rejected',
}

@Entity({
  name: 'kyb_documents',
})
export class KybDocument extends BaseEntity {
  @Column({ name: 'business_id' })
  businessId: string

  @Column({ name: 'user_id' })
  userId: string

  @Column({
    name: 'document_type',
    type: 'enum',
    enum: KybDocumentType,
  })
  documentType: KybDocumentType

  @Column({ name: 'document_url' })
  documentUrl: string

  @Column({ name: 'uploaded_at', type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  uploadedAt: Date

  @Column({ name: 'verified_at', type: 'timestamp', nullable: true })
  verifiedAt: Date

  @Column({
    name: 'status',
    type: 'enum',
    enum: KybDocumentStatus,
    default: KybDocumentStatus.PENDING,
  })
  status: KybDocumentStatus

  @ManyToOne(() => Business)
  @JoinColumn({ name: 'business_id' })
  business: Business

  @ManyToOne(() => User)
  @JoinColumn({ name: 'user_id' })
  user: User
}
