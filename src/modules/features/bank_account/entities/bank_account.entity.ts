import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryColumn,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm'

@Entity('bank_accounts')
export class BankAccount {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column()
  accountNumber: string

  @Column({ nullable: true })
  accountName: string

  @Column()
  bankName: string

  @Column()
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

  // Autosweep functionality
  @Column({ default: false })
  autosweepEnabled: boolean

  @Column({ nullable: true })
  masterAccountId: string

  @Column({ nullable: true })
  businessId: string

  @Column({ nullable: true })
  personId: string

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
}
