import { IsISO8601, IsNotEmpty, IsString } from 'class-validator';

export class DocumentDto {
  @IsString()
  @IsNotEmpty()
  type: string;

  @IsISO8601()
  @IsNotEmpty()
  issueDate: string;

  @IsISO8601()
  @IsNotEmpty()
  expiryDate: string;

  @IsString()
  @IsNotEmpty()
  documentUrl: string;
}
