import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm'

import { User } from '@features/user/entities/user.entity'
import { BaseEntity } from '@global/entities/base.entity'

interface BusinessAddress {
  line1: string
  line2?: string | null
  city: string
  state: string
  country: string
  postalCode: string
}

@Entity('businesses')
export class Business extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column({ name: 'owner_id' })
  ownerId: string

  @Column({ name: 'partner_entity_id' })
  partnerEntityId: string

  // Basic Information Section
  @Column({ nullable: true })
  name: string

  @Column({
    name: 'business_type',
    type: 'enum',
    enum: ['soleProprietor', 'singleMemberLLC', 'limitedLiabilityCompany'],
    nullable: true,
  })
  businessType: string

  @Column({
    type: 'enum',
    enum: ['restaurants', 'hotelMotel', 'otherFoodServices'],
    nullable: true,
  })
  industry: string

  @Column({ name: 'contact_phone', nullable: true })
  contactPhone: string

  @Column({ name: 'contact_email', nullable: true })
  contactEmail: string

  @Column({
    name: 'address',
    type: 'jsonb',
    nullable: true,
    transformer: {
      to: (value: BusinessAddress): any => ({
        line1: value.line1,
        line2: value.line2,
        city: value.city,
        state: value.state,
        country: value.country,
        postal_code: value.postalCode,
      }),
      from: (value: any): BusinessAddress => ({
        line1: value.line1,
        line2: value.line2,
        city: value.city,
        state: value.state,
        country: value.country,
        postalCode: value.postal_code,
      }),
    },
  })
  address: BusinessAddress

  // Identification Information Section
  @Column({
    name: 'id_type',
    type: 'enum',
    enum: ['ein', 'cac'],
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

  @Column({
    name: 'id_level',
    type: 'enum',
    enum: ['primary', 'secondary'],
    nullable: true,
  })
  idLevel: string

  @Column({ name: 'dof', type: 'date', nullable: true })
  dof: Date

  // Document Section
  @Column({ name: 'business_registration_doc', nullable: true })
  businessRegistrationDoc: string

  @Column({ name: 'proof_of_address_doc', nullable: true })
  proofOfAddressDoc: string

  // Status Tracking
  @Column({
    name: 'registration_status',
    type: 'enum',
    enum: [
      'draft',
      'basic_info_completed',
      'identification_completed',
      'documents_completed',
      'completed',
    ],
    default: 'draft',
  })
  registrationStatus: string

  @Column({ name: 'kyb_status', nullable: true })
  kybStatus: string

  @Column({ name: 'kyb_response', type: 'jsonb', nullable: true })
  kybResponse: Record<string, any>

  @ManyToOne(() => User)
  @JoinColumn({ name: 'owner_id' })
  owner: User
}
