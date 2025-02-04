// src/user/dto/kyc.dto.ts
import {
  IsNotEmpty,
  IsString,
  IsEnum,
  IsEmail,
  IsPhoneNumber,
  IsISO8601,
  IsOptional,
  ValidateNested,
  IsObject,
} from 'class-validator';
import { Type } from 'class-transformer';

export class AddressDto {
  @IsObject()
  @IsOptional()
  address: Record<string, any> = {};
}

export class BackgroundInformationDto {
  @IsObject()
  @IsOptional()
  background_information: Record<string, any> = {};
}

export class UserKycDto {
  @IsPhoneNumber()
  @IsNotEmpty()
  phone: string;

  @IsISO8601()
  @IsNotEmpty()
  dob: string;

  @IsString()
  @IsEnum(['primary', 'secondary'])
  id_level: string;

  @IsString()
  @IsEnum(['passport', 'national_id', 'drivers_license'])
  id_type: string;

  @IsString()
  @IsNotEmpty()
  id_number: string;

  @IsString()
  @IsEnum(['US', 'NG'])
  id_country: string;

  @IsString()
  @IsNotEmpty()
  bank_id_number: string;

  @IsString()
  @IsEnum(['basic', 'intermediate', 'advanced'])
  kyc_level: string;

  @ValidateNested()
  @Type(() => AddressDto)
  @IsOptional()
  address?: AddressDto;

  @ValidateNested()
  @Type(() => BackgroundInformationDto)
  @IsOptional()
  background_information?: BackgroundInformationDto;

  @IsOptional()
  documents?: any[] = [];
}
