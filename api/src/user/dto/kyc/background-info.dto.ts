import { IsEnum, IsNotEmpty, IsString } from 'class-validator';

export class BackgroundInfoDto {
  @IsString()
  @IsEnum(['employed', 'self_employed', 'unemployed', 'student'])
  employment_status: string;

  @IsString()
  @IsNotEmpty()
  occupation: string;

  @IsString()
  @IsEnum(['business', 'personal', 'investment'])
  primary_purpose: string;

  @IsString()
  @IsEnum(['salary', 'business_income', 'investments', 'other'])
  source_of_fund: string;

  @IsString()
  @IsEnum(['0-1000', '1001-5000', '5001-10000', '10001+'])
  expected_monthly: string;
}
