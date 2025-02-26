import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm'

@Entity('deposits')
export class Deposit {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column({ nullable: true })
  depositId: string

  @Column({ nullable: true })
  transactionId: string

  @Column()
  accountId: string

  @Column({ type: 'decimal', precision: 20, scale: 2 })
  amount: number

  @Column({ type: 'decimal', precision: 20, scale: 2 })
  balanceBefore: number

  @Column({ type: 'decimal', precision: 20, scale: 2 })
  balanceAfter: number

  @Column()
  currency: string

  @Column({ nullable: true })
  description: string

  @Column()
  status: string

  @Column()
  type: string

  @Column()
  kind: string

  @Column({ nullable: true })
  linkedTransactionId: string

  @Column({ nullable: true })
  payoutId: string

  // Wallet account details
  @Column()
  walletAccountId: string

  @Column()
  walletCurrency: string

  @Column({ type: 'decimal', precision: 20, scale: 2 })
  walletBalance: number

  @Column({ nullable: true })
  walletKind: string

  @Column()
  walletStatus: string

  // Deposit details
  @Column({ nullable: true })
  depositObjectType: string

  @Column({ nullable: true })
  depositAccountType: string

  @Column({ nullable: true })
  depositType: string

  @Column({ nullable: true, type: 'int' })
  depositConfirmations: number

  @Column({ nullable: true, type: 'decimal', precision: 20, scale: 2 })
  depositAmountSource: number

  @Column({ nullable: true, type: 'decimal', precision: 20, scale: 2 })
  depositAmountSettled: number

  @Column({ nullable: true, type: 'decimal', precision: 20, scale: 2 })
  depositFee: number

  @Column({ nullable: true })
  depositSettlementType: string

  @Column({ nullable: true, type: 'decimal', precision: 10, scale: 6 })
  depositSettlementRate: number

  @Column({ nullable: true })
  depositCurrencySource: string

  @Column({ nullable: true })
  depositNetwork: string

  @Column({ nullable: true })
  depositChainHash: string

  @CreateDateColumn()
  createdAt: Date

  @UpdateDateColumn()
  updatedAt: Date

  @Column({ type: 'timestamp', nullable: true })
  transactionCreatedAt: Date

  @Column({ type: 'timestamp', nullable: true })
  transactionUpdatedAt: Date

  @Column({ type: 'timestamp', nullable: true })
  depositCreatedAt: Date

  @Column({ type: 'timestamp', nullable: true })
  depositUpdatedAt: Date
}
