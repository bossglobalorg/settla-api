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
import { BusinessBasicInfoDto } from './basic-business.dto';
import { BusinessDocumentsDto } from './business-document.dto';
import { BusinessIdentificationDto } from './business-identification.dto';

export class CreateBusinessDto {
  @IsString()
  @IsNotEmpty()
  owner_id: string;

  @ValidateNested()
  @Type(() => BusinessBasicInfoDto)
  basic_info: BusinessBasicInfoDto;

  @ValidateNested()
  @Type(() => BusinessIdentificationDto)
  identification: BusinessIdentificationDto;

  @ValidateNested()
  @Type(() => BusinessDocumentsDto)
  documents: BusinessDocumentsDto;
}
