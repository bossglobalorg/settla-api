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

export enum PayoutDestinationType {
  BANK_ACCOUNT = 'bank_account',
  WALLET_ADDRESS = 'wallet_address',
}

export enum PayoutAccountType {
  PERSONAL = 'personal',
  BUSINESS = 'business',
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

  @Column({
    type: 'varchar',
    name: 'destination_type',
    nullable: true,
  })
  destinationType: PayoutDestinationType | null

  @Column({
    type: 'varchar',
    name: 'account_type',
    nullable: true,
  })
  accountType: string | null

  @Column({ name: 'wire_type', nullable: true, type: 'varchar' })
  wireType: string | null

  @Column({ name: 'bank_code', nullable: true, type: 'varchar' })
  bankCode: string | null

  @Column({ name: 'bank_name', nullable: true, type: 'varchar' })
  bankName: string | null

  @Column({ name: 'account_number', nullable: true, type: 'varchar' })
  accountNumber: string | null

  @Column({ name: 'routing_number', nullable: true, type: 'varchar' })
  routingNumber: string | null

  @Column({ name: 'routing_type', nullable: true, type: 'varchar' })
  routingType: string | null

  @Column({ name: 'account_name', nullable: true, type: 'varchar' })
  accountName: string | null

  @Column({ name: 'beneficiary_name', nullable: true, type: 'varchar' })
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
