import { IsNotEmpty, IsEnum, IsString, IsISO8601 } from 'class-validator';
import { Transform, Type } from 'class-transformer';

export class BusinessIdentificationDto {
  @IsString()
  @IsEnum(['ein', 'cac'], {
    message: 'Invalid ID type selected',
  })
  id_type: string;

  @IsString()
  @IsNotEmpty({ message: 'ID number is required' })
  id_number: string;

  @IsString()
  @IsEnum(['US', 'NG'], {
    message: 'Invalid country selected',
  })
  id_country: string;

  @IsString()
  @IsEnum(['primary', 'secondary'], {
    message: 'Invalid ID level selected',
  })
  id_level: string;

  @Transform(({ value }) => {
    if (value) {
      return new Date(value).toISOString();
    }
    return value;
  })
  @IsISO8601()
  @IsNotEmpty({ message: 'Date of foundation is required' })
  dof: Date;
}
