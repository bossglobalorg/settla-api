import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm'

import { PartnerEntityType, PartnerName } from '../enums/partner-reference.enum'

@Entity('partner_references')
export class PartnerReference {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column({ name: 'entity_id' })
  entityId: string

  @Column({
    name: 'entity_type',
    type: 'enum',
    enum: PartnerEntityType,
  })
  entityType: PartnerEntityType

  @Column({
    name: 'partner_name',
    type: 'enum',
    enum: PartnerName,
  })
  partnerName: PartnerName

  @Column({ name: 'partner_entity_id' })
  partnerEntityId: string

  @Column({ name: 'metadata', type: 'jsonb', nullable: true })
  metadata: Record<string, any>

  @Column({ name: 'verification_status', nullable: true })
  verificationStatus: string

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date
}
