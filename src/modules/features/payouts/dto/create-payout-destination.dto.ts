import { IsEnum, IsOptional, IsString } from 'class-validator'
import { IsNotEmpty } from 'class-validator'

import { PayoutType } from '../entities/payout-destination.entity'

export class CreatePayoutDestinationDto {
  @IsString()
  @IsNotEmpty()
  accountId: string

  @IsString()
  @IsNotEmpty()
  sourceType: string

  @IsEnum(PayoutType)
  type: PayoutType

  @IsEnum(['bank_account', 'wallet_address'])
  @IsOptional()
  destinationType: string

  @IsEnum(['personal', 'business'])
  @IsOptional()
  accountType: string

  @IsEnum(['domestic', 'international'])
  @IsOptional()
  wireType: string

  @IsString()
  @IsOptional()
  bankCode: string

  @IsString()
  @IsOptional()
  bankName: string

  @IsString()
  @IsOptional()
  accountNumber: string

  @IsString()
  @IsOptional()
  routingNumber: string
}
