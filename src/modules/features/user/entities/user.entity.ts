import { Column, Entity, JoinColumn, OneToMany } from 'typeorm'

import { BankAccount } from '@features/bank_account/entities/bank_account.entity'
import { BaseEntity } from '@global/entities/base.entity'
import { PartnerReference } from '@global/entities/partner-reference.entity'

import { Business } from '../../business/entities/business.entity'
import { BackgroundInfoDto } from '../dto/kyc/background-info.dto'
import { DocumentDto } from '../dto/kyc/document.dto'

interface UserAddress {
  line1: string
  line2?: string | null
  city: string
  state: string
  country: string
  postalCode: string
}

@Entity({
  name: 'users',
})
export class User extends BaseEntity {
  @Column({
    name: 'first_name',
  })
  firstName: string

  @Column({
    name: 'last_name',
  })
  lastName: string

  @Column({
    name: 'other_name',
    nullable: true,
  })
  otherName: string

  @Column()
  email: string

  @Column({
    name: 'business_name',
  })
  businessName: string

  @Column({
    name: 'password',
  })
  passwordHash: string

  @Column({
    name: 'email_verified',
    type: 'boolean',
    default: false,
  })
  emailVerified: boolean

  @Column({ nullable: true })
  phone: string

  @Column({ name: 'dob', type: 'date', nullable: true })
  dob: Date

  @Column({
    name: 'id_level',
    type: 'enum',
    enum: ['primary', 'secondary'],
    nullable: true,
  })
  idLevel: string

  @Column({
    name: 'id_type',
    type: 'enum',
    enum: ['passport', 'national_id', 'drivers_license', 'nin'],
    nullable: true,
  })
  idType: string

  @Column({ name: 'id_number', nullable: true })
  idNumber: string

  @Column({
    name: 'id_country',
    type: 'enum',
    enum: ['US', 'NG'],
    nullable: true,
  })
  idCountry: string

  @Column({ name: 'bank_id_number', nullable: true })
  bankIdNumber: string

  @Column({
    name: 'kyc_level',
    type: 'enum',
    enum: ['basic', 'preliminary'],
    nullable: true,
  })
  kycLevel: string

  @Column({
    name: 'address',
    type: 'jsonb',
    nullable: true,
    transformer: {
      to: (value: UserAddress | null | undefined): any => {
        if (!value) return null

        return {
          line1: value.line1,
          line2: value.line2,
          city: value.city,
          state: value.state,
          country: value.country,
          postal_code: value.postalCode,
        }
      },
      from: (value: any): UserAddress | null => {
        if (!value) return null

        return {
          line1: value.line1,
          line2: value.line2,
          city: value.city,
          state: value.state,
          country: value.country,
          postalCode: value.postal_code,
        }
      },
    },
  })
  address: UserAddress

  @Column({
    name: 'background_information',
    type: 'jsonb',
    nullable: true,
    transformer: {
      to: (value: BackgroundInfoDto | null): any => {
        if (!value) return null
        return {
          employment_status: value.employmentStatus,
          expected_monthly: value.expectedMonthly,
          occupation: value.occupation,
          primary_purpose: value.primaryPurpose,
          source_of_funds: value.sourceOfFunds,
        }
      },
      from: (value: any | null): BackgroundInfoDto | null => {
        if (!value) return null
        return {
          employmentStatus: value.employment_Status,
          expectedMonthly: value.expected_monthly,
          occupation: value.occupation,
          primaryPurpose: value.primary_purpose,
          sourceOfFunds: value.source_of_funds,
        }
      },
    },
  })
  backgroundInformation: BackgroundInfoDto

  @Column({ nullable: true })
  token: string

  @Column({ name: 'kyc_status', nullable: true })
  kycStatus: string

  @Column({
    name: 'documents',
    type: 'jsonb',
    nullable: true,
    transformer: {
      to: (docs: DocumentDto[] | null): any => {
        if (!docs) return null
        return docs.map((doc) => ({
          type: doc.type,
          issueDate: doc.issueDate,
          expiryDate: doc.expiryDate,
          documentUrl: doc.documentUrl,
        }))
      },
      from: (docs: any[] | null): DocumentDto[] | null => {
        if (!docs) return null
        return docs.map((doc) => ({
          type: doc.type,
          issueDate: doc.issue_date,
          expiryDate: doc.expiry_date,
          documentUrl: doc.document_url,
        }))
      },
    },
  })
  documents: DocumentDto[]

  @Column({
    name: 'kyc_step',
    type: 'enum',
    enum: ['draft', 'personal_info', 'identification', 'background', 'documents', 'completed'],
    default: 'draft',
  })
  kycStep: string

  @Column({ name: 'proof_of_address', nullable: true })
  proofOfAddress: string

  @Column({ name: 'kyc_response', type: 'jsonb', nullable: true })
  kycResponse: Record<string, any>

  @OneToMany(() => Business, (business) => business.ownerId)
  businesses: Business[]

  @OneToMany(() => PartnerReference, (partnerRef) => partnerRef.entityId)
  @JoinColumn({ name: 'id', referencedColumnName: 'entityId' })
  partnerReferences: PartnerReference[]

  @OneToMany(() => BankAccount, (bankAccount) => bankAccount.user)
  bankAccounts: BankAccount[]
}
