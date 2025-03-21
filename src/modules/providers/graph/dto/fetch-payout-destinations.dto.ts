import {
  IsString,
  IsBoolean,
  IsOptional,
  ValidateNested,
  IsNumber,
  IsArray,
  IsDateString,
} from 'class-validator';
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

export class PayoutDestinationDto {
  @IsString()
  id: string;

  @IsString()
  account_id: string;

  @IsString()
  @IsOptional()
  destination_account_id: string;

  @IsString()
  source_type: string;

  @IsString()
  destination_type: string;

  @IsString()
  label: string;

  @IsString()
  type: string;

  @IsString()
  currency: string;

  @IsString()
  wire_type: string;

  @IsString()
  @IsOptional()
  account_name: string;

  @IsString()
  account_number: string;

  @IsString()
  account_type: string;

  @IsString()
  routing_number: string;

  @IsString()
  routing_type: string;

  @IsString()
  @IsOptional()
  bank_id: string;

  @IsString()
  bank_name: string;

  @IsString()
  @IsOptional()
  bank_code: string;

  @ValidateNested()
  @Type(() => AddressDto)
  bank_address: AddressDto;

  @IsString()
  beneficiary_name: string;

  @ValidateNested()
  @Type(() => AddressDto)
  beneficiary_address: AddressDto;

  @IsBoolean()
  is_deleted: boolean;

  @IsDateString()
  created_at: string;

  @IsDateString()
  updated_at: string;
}

class MetaDto {
  @IsNumber()
  per_page: number;

  @IsNumber()
  page: number;

  @IsNumber()
  count_total: number;

  @IsNumber()
  page_total: number;

  @IsBoolean()
  prev_page: boolean;

  @IsBoolean()
  next_page: boolean;
}

export class FetchPayoutDestinationsResponseDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => PayoutDestinationDto)
  data: PayoutDestinationDto[];

  @IsString()
  message: string;

  @ValidateNested()
  @Type(() => MetaDto)
  meta: MetaDto;

  @IsString()
  status: string;
}
