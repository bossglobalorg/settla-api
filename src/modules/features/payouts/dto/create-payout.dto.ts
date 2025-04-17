import { IsNumber, IsString } from 'class-validator'
import { IsNotEmpty } from 'class-validator'

export class CreatePayoutDto {
  @IsNumber()
  @IsNotEmpty()
  amount: number

  @IsString()
  @IsNotEmpty()
  description: string

  @IsString()
  @IsNotEmpty()
  destinationId: string
}
