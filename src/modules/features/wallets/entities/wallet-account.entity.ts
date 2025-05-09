import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  PrimaryColumn,
  UpdateDateColumn,
} from 'typeorm'

@Entity('wallet_accounts')
export class WalletAccount extends BaseEntity {
  @PrimaryColumn()
  id: string

  @Column()
  currency: string

  @Column({ type: 'decimal', precision: 20, scale: 2, default: 0 })
  balance: number

  @Column({ nullable: true })
  blockExpiry: Date

  @Column()
  kind: string

  @Column()
  status: string

  @Column({ default: false })
  isDeleted: boolean

  @CreateDateColumn()
  createdAt: Date

  @UpdateDateColumn()
  updatedAt: Date

  // Additional fields for our application
  @Column()
  userId: string
}
