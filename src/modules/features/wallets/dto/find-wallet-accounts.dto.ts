import { IsOptional, IsString, IsUUID } from 'class-validator'

export class FindWalletAccountsDto {
  @IsOptional()
  @IsUUID()
  userId?: string

  @IsOptional()
  @IsString()
  currency?: string

  @IsOptional()
  @IsString()
  status?: string
}
