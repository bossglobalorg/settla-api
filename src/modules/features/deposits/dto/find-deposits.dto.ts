import { Type } from 'class-transformer'
import { IsDateString, IsInt, IsOptional, IsString, Max, Min } from 'class-validator'

export class FindDepositsDto {
  @IsOptional()
  @IsString()
  accountId?: string

  @IsOptional()
  @IsString()
  status?: string

  @IsOptional()
  @IsDateString()
  startDate?: string

  @IsOptional()
  @IsDateString()
  endDate?: string

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number = 1

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100)
  limit?: number = 10
}
