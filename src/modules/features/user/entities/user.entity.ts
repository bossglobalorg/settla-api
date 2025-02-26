import { Column, Entity, JoinColumn, OneToMany } from 'typeorm'

import { BaseEntity } from '@global/entities/base.entity'
import { PartnerReference } from '@global/entities/partner-reference.entity'

import { Business } from '../../business/entities/business.entity'
import { DocumentDto } from '../dto/kyc/document.dto'

@Entity({
  name: 'users',
})
export class UserEntity extends BaseEntity {
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

  @Column({ type: 'date', nullable: true })
  dob: Date

  @Column({
    type: 'enum',
    enum: ['primary', 'secondary'],
    nullable: true,
    name: 'id_level',
  })
  idLevel: string

  @Column({
    type: 'enum',
    enum: ['passport', 'national_id', 'drivers_license', 'nin'],
    nullable: true,
    name: 'id_type',
  })
  idType: string

  @Column({ nullable: true, name: 'id_number' })
  idNumber: string

  @Column({
    type: 'enum',
    enum: ['US', 'NG'],
    nullable: true,
    name: 'id_country',
  })
  idCountry: string

  @Column({ nullable: true, name: 'bank_id_number' })
  bankIdNumber: string

  @Column({
    type: 'enum',
    enum: ['basic', 'preliminary'],
    nullable: true,
    name: 'kyc_level',
  })
  kycLevel: string

  @Column({ type: 'jsonb', nullable: true })
  address: Record<string, any>

  @Column({ type: 'jsonb', nullable: true })
  background_information: Record<string, any>

  @Column({ nullable: true })
  token: string

  @Column({ nullable: true })
  kyc_status: string

  @Column({ type: 'jsonb', nullable: true })
  documents: DocumentDto[]

  @Column({
    type: 'enum',
    enum: ['draft', 'personal_info', 'identification', 'background', 'documents', 'completed'],
    default: 'draft',
  })
  kyc_step: string

  @Column({ nullable: true })
  proof_of_address: string

  @Column({ type: 'jsonb', nullable: true })
  kyc_response: any

  @OneToMany(() => Business, (business) => business.owner_id)
  businesses: Business[]

  @OneToMany(() => PartnerReference, (partnerRef) => partnerRef.entity_id)
  @JoinColumn({ name: 'id', referencedColumnName: 'entity_id' })
  partner_references: PartnerReference[]
}
