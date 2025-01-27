import {
  IsNotEmpty,
  IsString,
  IsEnum,
  IsObject,
  IsOptional,
} from 'class-validator';

export class CreateBusinessDto {
  @IsNotEmpty()
  @IsString()
  owner_id: string;

  @IsNotEmpty()
  @IsString()
  name: string;

  @IsEnum(['soleProprietor', 'singleMemberLLC', 'limitedLiabilityCompany'])
  business_type: string;

  @IsEnum(['restaurants', 'hotelMotel', 'otherFoodServices'])
  industry: string;

  @IsEnum(['ein', 'cac'])
  id_type: string;

  @IsNotEmpty()
  @IsString()
  id_number: string;

  @IsEnum(['US', 'NG'])
  id_country: string;

  @IsNotEmpty()
  @IsString()
  id_upload: string;

  @IsEnum(['primary', 'secondary'])
  id_level: string;

  @IsNotEmpty()
  dof: Date;

  @IsOptional()
  @IsString()
  contact_phone?: string;

  @IsOptional()
  @IsString()
  contact_email?: string;

  @IsObject()
  address: {
    line1: string;
    line2?: string;
    city: string;
    state: string;
    country: string;
    postal_code: string;
  };
}
