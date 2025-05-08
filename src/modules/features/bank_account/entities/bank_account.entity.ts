import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryColumn,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm'

import { Business } from '@features/business/entities/business.entity'
import { User } from '@features/user/entities/user.entity'

@Entity('bank_accounts')
export class BankAccount {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column({
    nullable: true,
  })
  accountNumber: string

  @Column({ nullable: true })
  accountName: string

  @Column({
    nullable: true,
  })
  bankName: string

  @Column({
    nullable: true,
  })
  bankCode: string

  @Column()
  currency: string

  @Column({ nullable: true })
  branchCode: string

  @Column({ nullable: true })
  swiftCode: string

  @Column({ nullable: true })
  routingNumber: string

  @Column({ nullable: true })
  iban: string

  @Column()
  status: string

  @Column()
  type: string

  @Column({ default: false })
  whitelistEnabled: boolean

  @Column({ type: 'json', nullable: true })
  whitelist: object

  @Column({ nullable: true })
  balance: number

  // Autosweep functionality
  @Column({ default: false })
  autosweepEnabled: boolean

  @Column({ nullable: true })
  masterAccountId: string

  @Column({ nullable: true })
  businessId: string

  @Column({ nullable: true })
  holderId: string

  @Column({ nullable: true })
  userId: string

  @Column()
  label: string

  @Column({ default: false })
  isVerified: boolean

  @Column({ default: false })
  isPrimary: boolean

  @Column({ default: false })
  isDeleted: boolean

  @Column({ nullable: true, type: 'json' })
  metadata: object

  @CreateDateColumn()
  createdAt: Date

  @UpdateDateColumn()
  updatedAt: Date

  @ManyToOne(() => User, (user) => user.bankAccounts)
  @JoinColumn({ name: 'userId' })
  user: User

  @ManyToOne(() => Business, (business) => business.bankAccounts)
  @JoinColumn({ name: 'businessId' })
  business: User
}
