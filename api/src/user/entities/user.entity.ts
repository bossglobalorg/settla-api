import { Entity, Column, OneToMany } from 'typeorm';
import { BaseEntity } from '../../global/entities/base.entity';
import { Business } from '../../business/entities/business.entity';

@Entity({
  name: 'users',
})
export class UserEntity extends BaseEntity {
  @Column({
    name: 'first_name',
  })
  firstName: string;

  @Column({
    name: 'last_name',
  })
  lastName: string;

  @Column()
  email: string;

  @Column({
    name: 'business_name',
  })
  businessName: string;

  @Column({
    name: 'password',
  })
  passwordHash: string;

  @Column({
    name: 'email_verified',
    type: 'boolean',
    default: false,
  })
  emailVerified: boolean;

  @Column({ nullable: true })
  token: string;

  @Column({ nullable: true })
  kyc_status: string;

  @Column({ type: 'jsonb', nullable: true })
  kyc_response: any;

  @OneToMany(() => Business, (business) => business.owner_id)
  businesses: Business[];
}
