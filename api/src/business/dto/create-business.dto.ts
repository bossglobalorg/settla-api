import {
  IsNotEmpty,
  IsString,
  IsEnum,
  IsObject,
  IsOptional,
  IsEmail,
  IsPhoneNumber,
  ValidateNested,
  IsISO8601,
  ValidateIf,
} from 'class-validator';
import { Type } from 'class-transformer';

export class AddressDto {
  @IsString()
  @IsNotEmpty({ message: 'Address line 1 is required' })
  line1: string;

  @IsOptional()
  @IsString()
  line2?: string;

  @IsString()
  @IsNotEmpty({ message: 'City is required' })
  city: string;

  @IsString()
  @IsNotEmpty({ message: 'State is required' })
  state: string;

  @IsString()
  @IsNotEmpty({ message: 'Country is required' })
  country: string;

  @IsString()
  @IsNotEmpty({ message: 'Postal code is required' })
  postal_code: string;
}

export class CreateBusinessDto {
  @IsString()
  @IsNotEmpty()
  owner_id: string;

  @IsString()
  @IsNotEmpty({ message: 'Business name is required' })
  name: string;

  @IsString()
  @IsEnum(['soleProprietor', 'singleMemberLLC', 'limitedLiabilityCompany'], {
    message: 'Invalid business type selected',
  })
  business_type: string;

  @IsString()
  @IsEnum(['restaurants', 'hotelMotel', 'otherFoodServices'], {
    message: 'Invalid industry selected',
  })
  industry: string;

  @IsString()
  @IsEnum(['ein', 'cac'], {
    message: 'Invalid ID type selected',
  })
  id_type: string;

  @IsString()
  @IsNotEmpty({ message: 'ID number is required' })
  id_number: string;

  @IsString()
  @IsEnum(['US', 'NG'], {
    message: 'Invalid country selected',
  })
  id_country: string;

  @IsString()
  @IsNotEmpty()
  id_upload: string;

  @IsString()
  @IsEnum(['primary', 'secondary'], {
    message: 'Invalid ID level selected',
  })
  id_level: string;

  @IsISO8601()
  @IsNotEmpty({ message: 'Date of foundation is required' })
  @Type(() => Date)
  dof: Date;

  @IsPhoneNumber(undefined, { message: 'Please provide a valid phone number' })
  @IsNotEmpty({ message: 'Contact phone is required' })
  contact_phone: string;

  @IsEmail({}, { message: 'Please provide a valid email address' })
  @IsNotEmpty({ message: 'Contact email is required' })
  contact_email: string;

  // For nested address format
  @ValidateIf((o) => !o['address.line1'])
  @IsObject()
  @ValidateNested()
  @Type(() => AddressDto)
  address?: AddressDto;

  // For flat address format
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
