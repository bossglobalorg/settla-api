import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm'

import { User } from '@features/user/entities/user.entity'
import { WalletAccount } from '@features/wallets/entities/wallet-account.entity'

export interface BeneficiaryAddress {
  line1: string
  line2?: string
  city: string
  state: string
  country: string // ISO Alpha 2 country code format (e.g., 'US', 'NG')
  postal_code: string
}

export enum PayoutType {
  INTERNAL = 'internal',
  WIRE = 'wire',
  NIP = 'nip',
  STABLECOIN = 'stablecoin',
}

@Entity('payout_destinations')
export class PayoutDestination extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column({ name: 'user_id' })
  userId: string

  @ManyToOne(() => WalletAccount, (wallet) => wallet.id)
  @JoinColumn({ name: 'wallet_id' })
  wallet: WalletAccount

  @Column({ name: 'source_type' })
  sourceType: string

  @Column({
    type: 'enum',
    enum: PayoutType,
    name: 'type',
  })
  type: PayoutType

  @Column({ name: 'destination_type', nullable: true })
  destinationType: string | null

  @Column({ name: 'account_type', nullable: true })
  accountType: string | null

  @Column({ name: 'wire_type', nullable: true })
  wireType: string | null

  @Column({ name: 'bank_code', nullable: true })
  bankCode: string | null

  @Column({ name: 'bank_name', nullable: true })
  bankName: string | null

  @Column({ name: 'account_number', nullable: true })
  accountNumber: string | null

  @Column({ name: 'routing_number', nullable: true })
  routingNumber: string | null

  @Column({ name: 'routing_type', nullable: true })
  routingType: string | null

  @Column({ name: 'account_name', nullable: true })
  accountName: string | null

  @Column({ name: 'beneficiary_name', nullable: true })
  beneficiaryName: string | null

  @Column({
    type: 'jsonb',
    name: 'beneficiary_address',
    nullable: true,
  })
  beneficiaryAddress: BeneficiaryAddress | null

  @ManyToOne(() => User, (user) => user.id)
  @JoinColumn({ name: 'user_id' })
  user: User

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date
}
