import { Type } from 'class-transformer'
import {
  IsArray,
  IsBoolean,
  IsEmail,
  IsEnum,
  IsISO8601,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
  ValidateNested,
} from 'class-validator'

import { AddressDto } from './kyc.dto'

export class DocumentDto {
  @IsString()
  @IsNotEmpty()
  type: string

  @IsISO8601()
  @IsNotEmpty()
  issueDate: string

  @IsISO8601()
  @IsNotEmpty()
  expiryDate: string

  @IsString()
  @IsNotEmpty()
  documentUrl: string
}

export class BackgroundInformationDto {
  @IsString()
  @IsOptional()
  occupation?: string

  @IsString()
  @IsOptional()
  primaryPurpose?: string

  @IsString()
  @IsOptional()
  sourceOfFunds?: string

  @IsString()
  @IsOptional()
  expectedMonthly?: string

  @IsString()
  @IsOptional()
  employmentStatus?: string
}

export class SafeUserResponseDto {
  @IsUUID()
  @IsNotEmpty()
  id: string

  @IsISO8601()
  @IsNotEmpty()
  dateCreated: string

  @IsISO8601()
  @IsNotEmpty()
  dateUpdated: string

  @IsString()
  @IsNotEmpty()
  firstName: string

  @IsString()
  @IsNotEmpty()
  lastName: string

  @IsString()
  @IsOptional()
  otherName: string | null

  @IsEmail()
  @IsNotEmpty()
  email: string

  @IsString()
  @IsNotEmpty()
  businessName: string

  @IsBoolean()
  @IsNotEmpty()
  emailVerified: boolean

  @IsString()
  @IsOptional()
  phone: string | null

  @IsISO8601()
  @IsOptional()
  dob: string | null

  @IsString()
  @IsEnum(['primary', 'secondary'])
  @IsOptional()
  idLevel: string | null

  @IsString()
  @IsEnum(['passport', 'national_id', 'drivers_license', 'nin'])
  @IsOptional()
  idType: string | null

  @IsString()
  @IsOptional()
  idNumber: string | null

  @IsString()
  @IsEnum(['US', 'NG'])
  @IsOptional()
  idCountry: string | null

  @IsString()
  @IsOptional()
  bankIdNumber: string | null

  @IsString()
  @IsEnum(['basic', 'preliminary'])
  @IsOptional()
  kycLevel: string | null

  @ValidateNested()
  @Type(() => AddressDto)
  @IsOptional()
  address: AddressDto | null

  @ValidateNested()
  @Type(() => BackgroundInformationDto)
  @IsOptional()
  backgroundInformation: BackgroundInformationDto | null

  @IsString()
  @IsOptional()
  kycStatus: string | null

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => DocumentDto)
  @IsOptional()
  documents: DocumentDto[] | null

  @IsString()
  @IsEnum(['draft', 'personal_info', 'identification', 'background', 'documents', 'completed'])
  @IsNotEmpty()
  kycStep: string

  @IsString()
  @IsOptional()
  proofOfAddress: string | null

  constructor(user: any) {
    this.id = user.id
    this.dateCreated = user.dateCreated
    this.dateUpdated = user.dateUpdated
    this.firstName = user.firstName
    this.lastName = user.lastName
    this.otherName = user.otherName
    this.email = user.email
    this.businessName = user.businessName
    this.emailVerified = user.emailVerified
    this.phone = user.phone
    this.dob = user.dob
    this.idLevel = user.idLevel
    this.idType = user.idType
    this.idNumber = user.idNumber
    this.idCountry = user.idCountry
    this.bankIdNumber = user.bankIdNumber
    this.kycLevel = user.kycLevel
    this.address = user.address
    this.backgroundInformation = user.backgroundInformation
    this.kycStatus = user.kycStatus
    this.documents = user.documents
    this.kycStep = user.kycStep
    this.proofOfAddress = user.proofOfAddress
  }
}
