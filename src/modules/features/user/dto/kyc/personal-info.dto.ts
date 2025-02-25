import { Type } from 'class-transformer';
import {
  IsISO8601,
  IsNotEmpty,
  IsPhoneNumber,
  ValidateNested,
} from 'class-validator';
import { AddressDto } from '../kyc.dto';

export class PersonalInfoDto {
  @IsPhoneNumber()
  @IsNotEmpty()
  phone: string;

  @IsISO8601()
  @IsNotEmpty()
  dob: string;

  @ValidateNested()
  @Type(() => AddressDto)
  address: AddressDto;
}
