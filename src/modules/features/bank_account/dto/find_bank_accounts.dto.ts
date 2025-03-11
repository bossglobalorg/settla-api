import { Type } from 'class-transformer'
import { IsInt, IsOptional, IsString, IsUUID, Min } from 'class-validator'

export class FindBankAccountsDto {
  @IsInt()
  @Min(1)
  @IsOptional()
  @Type(() => Number)
  page?: number = 1

  @IsInt()
  @Min(1)
  @IsOptional()
  @Type(() => Number)
  limit?: number = 10

  @IsUUID()
  @IsOptional()
  userId?: string

  @IsUUID()
  @IsOptional()
  businessId?: string

  @IsUUID()
  @IsOptional()
  personId?: string

  @IsString()
  @IsOptional()
  status?: string

  @IsString()
  @IsOptional()
  currency?: string
}
