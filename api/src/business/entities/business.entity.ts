import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';
import { BaseEntity } from '../../global/entities/base.entity'; // Adjust path as needed

@Entity('businesses')
export class Business extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  owner_id: string;

  @Column()
  name: string;

  @Column({
    type: 'enum',
    enum: ['soleProprietor', 'singleMemberLLC', 'limitedLiabilityCompany'],
    default: 'soleProprietor',
  })
  business_type: string;

  @Column({
    type: 'enum',
    enum: ['restaurants', 'hotelMotel', 'otherFoodServices'],
    default: 'restaurants',
  })
  industry: string;

  @Column({
    type: 'enum',
    enum: ['ein', 'cac'],
    default: 'ein',
  })
  id_type: string;

  @Column()
  id_number: string;

  @Column({
    type: 'enum',
    enum: ['US', 'NG'],
  })
  id_country: string;

  @Column()
  id_upload: string;

  @Column({
    type: 'enum',
    enum: ['primary', 'secondary'],
  })
  id_level: string;

  @Column({ type: 'date' })
  dof: Date;

  @Column({ nullable: true })
  contact_phone: string;

  @Column({ nullable: true })
  contact_email: string;

  @Column({ type: 'jsonb' })
  address: {
    line1: string;
    line2?: string;
    city: string;
    state: string;
    country: string;
    postal_code: string;
  };

  @Column({ nullable: true })
  kyb_status: string;

  @Column({ type: 'jsonb', nullable: true })
  kyb_response: any;
}
