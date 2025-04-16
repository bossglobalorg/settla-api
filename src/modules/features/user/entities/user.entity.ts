import { Column, Entity, JoinColumn, OneToMany } from 'typeorm'

import { BankAccount } from '@features/bank_account/entities/bank_account.entity'
import { BaseEntity } from '@global/entities/base.entity'
import { PartnerReference } from '@global/entities/partner-reference.entity'

import { Business } from '../../business/entities/business.entity'
import { DocumentDto } from '../dto/kyc/document.dto'

interface UserAddress {
  line1: string
  line2?: string | null
  city: string
  state: string
  country: string
  postalCode: string
}

interface BackgroundInformation {
  // Add specific fields based on your needs
  [key: string]: any
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
      to: (value: UserAddress): any => ({
        line1: value.line1,
        line2: value.line2,
        city: value.city,
        state: value.state,
        country: value.country,
        postal_code: value.postalCode,
      }),
      from: (value: any): UserAddress => ({
        line1: value.line1,
        line2: value.line2,
        city: value.city,
        state: value.state,
        country: value.country,
        postalCode: value.postal_code,
      }),
    },
  })
  address: UserAddress

  @Column({
    name: 'background_information',
    type: 'jsonb',
    nullable: true,
  })
  backgroundInformation: BackgroundInformation

  @Column({ nullable: true })
  token: string

  @Column({ name: 'kyc_status', nullable: true })
  kycStatus: string

  @Column({ name: 'documents', type: 'jsonb', nullable: true })
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
