import { IsBoolean, IsNotEmpty, IsObject, IsOptional, IsString } from 'class-validator'

export class CreateBankAccountDto {
  @IsString()
  @IsOptional()
  business_id?: string // For business accounts

  @IsString()
  @IsOptional()
  person_id?: string // For personal accounts

  @IsString()
  @IsNotEmpty()
  label: string

  @IsString()
  @IsNotEmpty()
  currency: string = 'USD' // Default to USD

  @IsBoolean()
  @IsOptional()
  autosweep_enabled?: boolean = false

  @IsBoolean()
  @IsOptional()
  whitelist_enabled?: boolean = false

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
