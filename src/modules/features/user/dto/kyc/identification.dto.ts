import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator'

export class IdentificationDto {
  @IsString()
  @IsEnum(['primary', 'secondary'])
  @IsOptional()
  idLevel: string = 'primary'

  @IsString()
  @IsEnum(['passport', 'national_id', 'drivers_license', 'voters_card', 'nin'])
  idType: string

  @IsString()
  @IsNotEmpty()
  idNumber: string

  @IsString()
  @IsNotEmpty()
  bankIdNumber: string

  @IsString()
  @IsEnum(['NG', 'US'])
  idCountry: string

  @IsString()
  @IsEnum(['basic', 'preliminary'])
  @IsOptional()
  kycLevel: string = 'basic'
}
