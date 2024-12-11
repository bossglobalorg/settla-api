import { Entity, Column } from 'typeorm';
import { BaseEntity } from '../../global/entities/base.entity';

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
}
