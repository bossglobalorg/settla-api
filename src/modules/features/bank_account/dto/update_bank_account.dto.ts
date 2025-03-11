import { IsBoolean, IsOptional, IsString, IsUUID } from 'class-validator'

export class UpdateBankAccountDto {
  @IsString()
  @IsOptional()
  accountNumber?: string

  @IsString()
  @IsOptional()
  accountName?: string

  @IsString()
  @IsOptional()
  bankName?: string

  @IsString()
  @IsOptional()
  bankCode?: string

  @IsString()
  @IsOptional()
  currency?: string

  @IsString()
  @IsOptional()
  branchCode?: string

  @IsString()
  @IsOptional()
  swiftCode?: string

  @IsString()
  @IsOptional()
  routingNumber?: string

  @IsString()
  @IsOptional()
  iban?: string

  @IsString()
  @IsOptional()
  status?: string

  @IsString()
  @IsOptional()
  type?: string

  @IsBoolean()
  @IsOptional()
  whitelistEnabled?: boolean

  @IsOptional()
  whitelist?: object

  @IsBoolean()
  @IsOptional()
  autosweepEnabled?: boolean

  @IsString()
  @IsOptional()
  masterAccountId?: string

  @IsString()
  @IsOptional()
  label?: string

  @IsBoolean()
  @IsOptional()
  isVerified?: boolean

  @IsBoolean()
  @IsOptional()
  isPrimary?: boolean

  @IsOptional()
  metadata?: object
}
