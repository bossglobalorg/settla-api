import { IsISO8601, IsNotEmpty, IsString } from 'class-validator';

export class DocumentDto {
  @IsString()
  @IsNotEmpty()
  type: string;

  @IsISO8601()
  @IsNotEmpty()
  issue_date: string;

  @IsISO8601()
  @IsNotEmpty()
  expiry_date: string;

  @IsString()
  @IsNotEmpty()
  document_url: string;
}
