import { IsString, IsNumber, IsNotEmpty } from 'class-validator';

export class CreatePayoutDto {
  @IsString()
  @IsNotEmpty()
  destination_id: string;

  @IsNumber()
  @IsNotEmpty()
  amount: number;

  @IsString()
  @IsNotEmpty()
  description: string;
}
