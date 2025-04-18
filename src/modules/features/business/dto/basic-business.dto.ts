import {
  IsNotEmpty,
  IsString,
  IsEnum,
  IsEmail,
  IsPhoneNumber,
  IsOptional,
} from 'class-validator';

export class BusinessBasicInfoDto {
  @IsString()
  @IsOptional()
  name?: string;

  @IsString()
  @IsEnum(['soleProprietor', 'singleMemberLLC', 'limitedLiabilityCompany'], {
    message: 'Invalid business type selected',
  })
  businessType: string;

  @IsString()
  @IsEnum(['restaurants', 'hotelMotel', 'otherFoodServices'], {
    message: 'Invalid industry selected',
  })
  industry: string;

  @IsPhoneNumber(undefined, { message: 'Please provide a valid phone number' })
  @IsNotEmpty({ message: 'Contact phone is required' })
  contactPhone: string;

  @IsEmail({}, { message: 'Please provide a valid email address' })
  @IsNotEmpty({ message: 'Contact email is required' })
  contactEmail: string;

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
  postalCode: string;
}
