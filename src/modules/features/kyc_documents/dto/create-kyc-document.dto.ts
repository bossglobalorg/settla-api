import { IsEnum, IsISO8601, IsNotEmpty, IsString } from 'class-validator'

import { KycDocumentType } from '../entities/kyc-document.entity'

export class CreateKycDocumentDto {
  @IsEnum(KycDocumentType)
  type: string

  @IsString()
  documentUrl: string

  @IsISO8601()
  @IsNotEmpty()
  issueDate: string

  @IsISO8601()
  @IsNotEmpty()
  expiryDate: string
}
