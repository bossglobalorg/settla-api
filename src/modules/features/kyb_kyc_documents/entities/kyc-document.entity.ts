import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm'

import { BaseEntity } from '@global/entities/base.entity'

import { User } from '../../user/entities/user.entity'

export enum KycDocumentType {
  PASSPORT = 'passport',
  NATIONAL_ID = 'national_id',
  DRIVERS_LICENSE = 'drivers_license',
  PROOF_OF_ADDRESS = 'proof_of_address',
  PROOF_OF_FUNDS = 'proof_of_funds',

  VOTERS_CARD = 'voters_card',
  RESIDENCE_PERMIT = 'residence_permit',

  // Address verification
  UTILITY_BILL = 'utility_bill',
  BANK_STATEMENT = 'bank_statement',
  TENANCY_AGREEMENT = 'tenancy_agreement',

  // Financial documents
  PROOF_OF_INCOME = 'proof_of_income',
  TAX_RETURN = 'tax_return',
  PAYSLIP = 'payslip',

  // Additional verification
  SELFIE = 'selfie',
  VIDEO_VERIFICATION = 'video_verification',
  SIGNATURE = 'signature',

  // Others
  OTHER = 'other',
}

export enum KycDocumentStatus {
  PENDING = 'pending',
  APPROVED = 'approved',
  REJECTED = 'rejected',
}

@Entity({
  name: 'kyc_documents',
})
export class KycDocument extends BaseEntity {
  @Column({ name: 'user_id' })
  userId: string

  @Column({
    name: 'document_type',
    type: 'enum',
    enum: KycDocumentType,
  })
  documentType: KycDocumentType

  @Column({ name: 'document_url' })
  documentUrl: string

  @Column({ name: 'uploaded_at', type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  uploadedAt: Date

  @Column({ name: 'verified_at', type: 'timestamp', nullable: true })
  verifiedAt: Date

  @Column({
    name: 'status',
    type: 'enum',
    enum: KycDocumentStatus,
    default: KycDocumentStatus.PENDING,
  })
  status: KycDocumentStatus

  @ManyToOne(() => User)
  @JoinColumn({ name: 'user_id' })
  user: User
}
