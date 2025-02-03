import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class BusinessDocumentsDto {
  @IsString()
  @IsNotEmpty({ message: 'Business registration document is required' })
  business_registration: string;

  @IsString()
  @IsOptional()
  proof_of_address?: string;
}
