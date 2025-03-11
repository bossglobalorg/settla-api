import { IsBoolean, IsDateString, IsNumber, IsOptional, IsString } from 'class-validator'

export class BankAccountResponseDto {
  @IsString()
  id: string

  @IsString()
  holder_id: string

  @IsString()
  holder_type: string

  @IsString()
  label: string

  @IsString()
  account_name: string

  @IsString()
  account_number: string

  @IsString()
  @IsOptional()
  routing_number?: string

  @IsString()
  bank_name: string

  @IsString()
  bank_code: string

  @IsString()
  bank_address: string

  @IsString()
  currency: string

  @IsNumber()
  balance: number

  @IsNumber()
  credit_pending: number

  @IsNumber()
  debit_pending: number

  @IsString()
  type: string

  @IsString()
  status: string

  @IsBoolean()
  is_deleted: boolean

  @IsDateString()
  created_at: string

  @IsDateString()
  updated_at: string
}

export class BankAccountResponseWrapperDto {
  @IsString()
  message: string

  data: BankAccountResponseDto

  @IsString()
  status: string
}
