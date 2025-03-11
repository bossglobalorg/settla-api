import { IsBoolean, IsNotEmpty, IsObject, IsOptional, IsString } from 'class-validator'

export class CreateBankAccountDto {
  @IsString()
  @IsOptional()
  businessId?: string // For business accounts

  @IsString()
  @IsOptional()
  personId?: string // For personal accounts

  @IsString()
  @IsNotEmpty()
  label: string

  @IsString()
  @IsNotEmpty()
  currency: string = 'USD' // Default to USD

  @IsBoolean()
  @IsOptional()
  autosweepEnabled?: boolean = false

  @IsBoolean()
  @IsOptional()
  whitelistEnabled?: boolean = false

  @IsObject()
  @IsOptional()
  whitelist?: object

  // Additional fields we need internally
  @IsString()
  @IsOptional()
  userId?: string // Our internal user reference

  @IsBoolean()
  @IsOptional()
  isPrimary?: boolean = false
}
