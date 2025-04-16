import { Type } from 'class-transformer'
import { IsNumber, IsOptional, Min } from 'class-validator'

import { PayoutDestination } from '../entities/payout-destination.entity'

export class PaginationParamsDto {
  @IsOptional()
  @IsNumber()
  @Min(1)
  @Type(() => Number)
  page?: number = 1

  @IsOptional()
  @IsNumber()
  @Min(1)
  @Type(() => Number)
  limit?: number = 10
}

export class PaginationMetaDto {
  total: number
  page: number
  lastPage: number
  limit: number
}

export class PaginatedPayoutDestinationsDto {
  data: PayoutDestination[]
  meta: PaginationMetaDto
}
