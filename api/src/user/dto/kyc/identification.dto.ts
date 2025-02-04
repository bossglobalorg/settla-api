import { IsEnum, IsNotEmpty, IsString } from 'class-validator';

export class IdentificationDto {
  @IsString()
  @IsEnum(['primary', 'secondary'])
  id_level: string;

  @IsString()
  @IsEnum(['passport', 'national_id', 'drivers_license', 'voters_card'])
  id_type: string;

  @IsString()
  @IsNotEmpty()
  id_number: string;

  @IsString()
  @IsNotEmpty()
  bank_id_number: string;

  @IsString()
  @IsEnum(['NG', 'US'])
  id_country: string;

  @IsString()
  @IsEnum(['basic', 'preliminary'])
  kyc_level: string;
}
