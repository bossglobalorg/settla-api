// src/business/dto/raw-business.dto.ts
import {
  IsString,
  IsNotEmpty,
  IsEmail,
  IsOptional,
  ValidateIf,
  Matches,
} from 'class-validator';
import { Type } from 'class-transformer';

export class RawBusinessDto {
  @IsString()
  @IsNotEmpty({ message: 'Business name is required' })
  name: string;

  @IsString()
  @IsNotEmpty({ message: 'Business type is required' })
  business_type: string;

  @IsString()
  @IsNotEmpty({ message: 'Industry is required' })
  industry: string;

  @IsString()
  @IsNotEmpty({ message: 'ID type is required' })
  id_type: string;

  @IsString()
  @IsNotEmpty({ message: 'ID number is required' })
  id_number: string;

  @IsString()
  @IsNotEmpty({ message: 'ID country is required' })
  id_country: string;

  @IsString()
  @IsNotEmpty({ message: 'ID level is required' })
  id_level: string;

  @IsString()
  @IsNotEmpty({ message: 'Date of foundation is required' })
  dof: string;

  @IsString()
  @IsNotEmpty({ message: 'Contact phone is required' })
  @Matches(/^\+?[1-9]\d{1,14}$/, {
    message: 'Contact phone must be a valid phone number (e.g., +1234567890)',
  })
  contact_phone: string;

  @IsEmail({}, { message: 'Please provide a valid email address' })
  @IsNotEmpty({ message: 'Contact email is required' })
  contact_email: string;

  // For nested object format
  @ValidateIf((o) => !o['address.line1'])
  @IsOptional()
  address?: {
    line1: string;
    line2?: string;
    city: string;
    state: string;
    country: string;
    postal_code: string;
  };

  // For flat format
  @ValidateIf((o) => !o.address)
  @IsString()
  @IsNotEmpty({ message: 'Address line 1 is required' })
  'address.line1'?: string;

  @IsOptional()
  @IsString()
  'address.line2'?: string;

  @ValidateIf((o) => !o.address)
  @IsString()
  @IsNotEmpty({ message: 'City is required' })
  'address.city'?: string;

  @ValidateIf((o) => !o.address)
  @IsString()
  @IsNotEmpty({ message: 'State is required' })
  'address.state'?: string;

  @ValidateIf((o) => !o.address)
  @IsString()
  @IsNotEmpty({ message: 'Country is required' })
  'address.country'?: string;

  @ValidateIf((o) => !o.address)
  @IsString()
  @IsNotEmpty({ message: 'Postal code is required' })
  'address.postal_code'?: string;
}
