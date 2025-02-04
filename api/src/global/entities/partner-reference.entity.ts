import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import {
  PartnerEntityType,
  PartnerName,
} from '../enums/partner-reference.enum';

@Entity('partner_references')
export class PartnerReference {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  entity_id: string;

  @Column({
    type: 'enum',
    enum: PartnerEntityType,
  })
  entity_type: PartnerEntityType;

  @Column({
    type: 'enum',
    enum: PartnerName,
  })
  partner_name: PartnerName;

  @Column()
  partner_entity_id: string;

  @Column({ type: 'jsonb', nullable: true })
  metadata: Record<string, any>;

  @Column({ nullable: true })
  verification_status: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
