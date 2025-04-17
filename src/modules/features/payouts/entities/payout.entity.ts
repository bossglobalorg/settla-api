import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm'

import { User } from '@features/user/entities/user.entity'

import { PayoutDestination } from './payout-destination.entity'

@Entity('payouts')
export class Payout extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column({ name: 'user_id' })
  userId: string

  @Column({ name: 'amount' })
  amount: number

  @Column({ name: 'description' })
  description: string

  @Column({ name: 'destination_id' })
  destinationId: string

  @OneToMany(() => User, (user) => user.id)
  @JoinColumn({ name: 'user_id' })
  user: User

  @OneToOne(() => PayoutDestination, (payoutDestination) => payoutDestination.id)
  @JoinColumn({ name: 'destination_id' })
  destination: PayoutDestination

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date
}
