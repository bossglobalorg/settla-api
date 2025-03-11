// src/bank-accounts/dto/fetch-bank-accounts.dto.ts
import { Type } from 'class-transformer'
import {
  IsArray,
  IsBoolean,
  IsDateString,
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator'

class AddressDto {
  @IsString()
  @IsOptional()
  line1: string

  @IsString()
  @IsOptional()
  line2: string

  @IsString()
  @IsOptional()
  city: string

  @IsString()
  @IsOptional()
  state: string

  @IsString()
  @IsOptional()
  country: string

  @IsString()
  @IsOptional()
  postal_code: string
}

export class BankAccountDto {
  @IsString()
  id: string

  @IsString()
  account_number: string

  @IsString()
  account_name: string

  @IsString()
  bank_name: string

  @IsString()
  bank_code: string

  @IsString()
  currency: string

  @IsString()
  @IsOptional()
  branch_code?: string

  @IsString()
  @IsOptional()
  swift_code?: string

  @IsString()
  @IsOptional()
  routing_number?: string

  @IsString()
  @IsOptional()
  iban?: string

  @IsString()
  type: string

  @IsString()
  status: string

  @IsBoolean()
  @IsOptional()
  whitelist_enabled?: boolean

  @IsOptional()
  whitelist?: object

  @IsBoolean()
  @IsOptional()
  autosweep_enabled?: boolean

  @IsString()
  @IsOptional()
  master_account_id?: string

  @IsString()
  label: string

  @IsBoolean()
  @IsOptional()
  is_verified?: boolean

  @IsBoolean()
  @IsOptional()
  is_primary?: boolean

  @IsBoolean()
  @IsOptional()
  is_deleted?: boolean

  @IsString()
  @IsOptional()
  business_id?: string

  @IsString()
  @IsOptional()
  person_id?: string

  @IsString()
  @IsOptional()
  user_id?: string

  @IsOptional()
  metadata?: object

  @IsDateString()
  created_at: string

  @IsDateString()
  updated_at: string
}

class MetaDto {
  @IsNumber()
  per_page: number

  @IsNumber()
  page: number

  @IsNumber()
  count_total: number

  @IsNumber()
  page_total: number

  @IsBoolean()
  prev_page: boolean

  @IsBoolean()
  next_page: boolean
}

export class FetchBankAccountsResponseDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => BankAccountDto)
  data: BankAccountDto[]

  @IsString()
  message: string

  @ValidateNested()
  @Type(() => MetaDto)
  meta: MetaDto

  @IsString()
  status: string
}
