import { IsEnum, IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class BackgroundInfoDto {
  @IsString()
  @IsEnum(['employed', 'self_employed', 'unemployed', 'student', 'retired'])
  employmentStatus: string;

  @IsString()
  @IsNotEmpty()
  occupation: string;

  @IsString()
  @IsEnum(['business', 'personal', 'salary', 'investment', 'personal'])
  primaryPurpose: string;

  @IsString()
  @IsEnum([
    'business',
    'investment',
    'personal',
    'salary',
    'investments',
    'pension',
    'other',
  ])
  sourceOfFunds: string;

  @IsNumber()
  expectedMonthly: number;
}
