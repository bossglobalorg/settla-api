import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm'

import { UserEntity } from '@features/user/entities/user.entity'
import { BaseEntity } from '@global/entities/base.entity'

@Entity('businesses')
export class Business extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column()
  owner_id: string

  @Column()
  partner_entity_id: string

  // Basic Information Section
  @Column({ nullable: true })
  name: string

  @Column({
    type: 'enum',
    enum: ['soleProprietor', 'singleMemberLLC', 'limitedLiabilityCompany'],
    nullable: true,
  })
  business_type: string

  @Column({
    type: 'enum',
    enum: ['restaurants', 'hotelMotel', 'otherFoodServices'],
    nullable: true,
  })
  industry: string

  @Column({ nullable: true })
  contact_phone: string

  @Column({ nullable: true })
  contact_email: string

  @Column({ type: 'jsonb', nullable: true })
  address: {
    line1: string
    line2?: string
    city: string
    state: string
    country: string
    postal_code: string
  }

  // Identification Information Section
  @Column({
    type: 'enum',
    enum: ['ein', 'cac'],
    nullable: true,
  })
  id_type: string

  @Column({ nullable: true })
  id_number: string

  @Column({
    type: 'enum',
    enum: ['US', 'NG'],
    nullable: true,
  })
  id_country: string

  @Column({
    type: 'enum',
    enum: ['primary', 'secondary'],
    nullable: true,
  })
  id_level: string

  @Column({ type: 'date', nullable: true })
  dof: Date

  // Document Section
  @Column({ nullable: true })
  business_registration_doc: string

  @Column({ nullable: true })
  proof_of_address_doc: string

  // Status Tracking
  @Column({
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
  registration_status: string

  @Column({ nullable: true })
  kyb_status: string

  @Column({ type: 'jsonb', nullable: true })
  kyb_response: any

  @ManyToOne(() => UserEntity)
  @JoinColumn({ name: 'owner_id' })
  owner: UserEntity
}
