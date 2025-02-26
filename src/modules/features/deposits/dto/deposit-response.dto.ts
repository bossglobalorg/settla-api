import { Deposit } from '../entities/deposit.entity'

export class PaginatedDepositsResponseDto {
  deposits: Deposit[]
  total: number
  page: number
  limit: number
  totalPages: number
}
