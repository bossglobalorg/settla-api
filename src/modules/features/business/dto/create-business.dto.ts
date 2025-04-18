import { Type } from 'class-transformer'
import { IsNotEmpty, IsString, ValidateNested } from 'class-validator'

import { BusinessBasicInfoDto } from './basic-business.dto'
import { BusinessDocumentsDto } from './business-document.dto'
import { BusinessIdentificationDto } from './business-identification.dto'

export class CreateBusinessDto {
  @IsString()
  @IsNotEmpty()
  ownerId: string

  @ValidateNested()
  @Type(() => BusinessBasicInfoDto)
  basicInfo: BusinessBasicInfoDto

  @ValidateNested()
  @Type(() => BusinessIdentificationDto)
  identification: BusinessIdentificationDto

  @ValidateNested()
  @Type(() => BusinessDocumentsDto)
  documents: BusinessDocumentsDto
}
