import { PartialType } from '@nestjs/mapped-types';
import { CreateBusinessDto } from './create-business.dto';
import { IsNotEmpty, IsString, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { BusinessBasicInfoDto } from './basic-business.dto';
import { BusinessIdentificationDto } from './business-identification.dto';
import { BusinessDocumentsDto } from './business-document.dto';

export class UpdateBusinessDto {
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
