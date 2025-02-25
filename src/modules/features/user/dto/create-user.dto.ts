import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsEnum,
} from 'class-validator';

export enum Country {
  US = 'US',
  NG = 'NG',
}

export class CreateUserDto {
  @IsString()
  firstName: string;

  @IsString()
  lastName: string;

  @IsEmail()
  email: string;

  @IsString()
  @IsNotEmpty()
  password: string;

  @IsString()
  @IsNotEmpty()
  businessName: string;

  @IsEnum(Country, { message: 'Country must be either US or NG' })
  @IsNotEmpty()
  country: Country;
}
