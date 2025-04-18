import { IsEnum, IsOptional, IsString } from 'class-validator'
import { IsNotEmpty } from 'class-validator'

import { PayoutDestinationType, PayoutType } from '../entities/payout-destination.entity'

export class CreatePayoutDestinationDto {
  @IsString()
  @IsNotEmpty()
  accountId: string

  @IsString()
  @IsNotEmpty()
  sourceType: string

  @IsEnum(PayoutType)
  type: PayoutType

  @IsEnum(PayoutDestinationType)
  @IsOptional()
  destinationType: PayoutDestinationType

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
