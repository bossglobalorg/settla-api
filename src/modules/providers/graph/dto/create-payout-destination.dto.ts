import { IsString, IsOptional, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

class AddressDto {
  @IsString()
  @IsOptional()
  line1: string;

  @IsString()
  @IsOptional()
  line2: string;

  @IsString()
  @IsOptional()
  city: string;

  @IsString()
  @IsOptional()
  state: string;

  @IsString()
  @IsOptional()
  country: string;

  @IsString()
  @IsOptional()
  postal_code: string;
}

class BeneficiaryAddressDto extends AddressDto {
  @IsString()
  @IsOptional()
  bank_name: string;
}

export class CreatePayoutDestinationDto {
  @ValidateNested()
  @Type(() => AddressDto)
  @IsOptional()
  bank_address: AddressDto;

  @ValidateNested()
  @Type(() => BeneficiaryAddressDto)
  @IsOptional()
  beneficiary_address: BeneficiaryAddressDto;

  @IsString()
  @IsOptional()
  account_id: string;

  @IsString()
  @IsOptional()
  source_type: string;

  @IsString()
  @IsOptional()
  label: string;

  @IsString()
  @IsOptional()
  type: string;

  @IsString()
  @IsOptional()
  wire_type: string;

  @IsString()
  @IsOptional()
  destination_account_id: string;

  @IsString()
  @IsOptional()
  destination_type: string;

  @IsString()
  @IsOptional()
  account_type: string;

  @IsString()
  @IsOptional()
  bank_code: string;

  @IsString()
  @IsOptional()
  account_number: string;

  @IsString()
  @IsOptional()
  routing_number: string;

  @IsString()
  @IsOptional()
  routing_type: string;

  @IsString()
  @IsOptional()
  beneficiary_name: string;
}
