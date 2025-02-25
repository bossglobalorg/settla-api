import { IsEnum, IsNotEmpty, IsString } from 'class-validator';

export class IdentificationDto {
  @IsString()
  @IsEnum(['primary', 'secondary'])
  idLevel: string;

  @IsString()
  @IsEnum(['passport', 'national_id', 'drivers_license', 'voters_card', 'nin'])
  idType: string;

  @IsString()
  @IsNotEmpty()
  idNumber: string;

  @IsString()
  @IsNotEmpty()
  bankIdNumber: string;

  @IsString()
  @IsEnum(['NG', 'US'])
  idCountry: string;

  @IsString()
  @IsEnum(['basic', 'preliminary'])
  kycLevel: string;
}
