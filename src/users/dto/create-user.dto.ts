import { ApiProperty } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import {
  IsBoolean,
  IsDefined,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsEmail,
  IsTimeZone,
  IsArray,
  ValidateNested,
} from 'class-validator';
import { isBoolean, isString } from 'lodash';
import { ImportantDate } from './important-date.dto';

export class CreateUserDto {
  @ApiProperty({ example: 'Aulia', description: 'The name of the User' })
  @IsString()
  name: string;

  @ApiProperty({
    example: 'aulia@wigundulmu.id',
    description: 'The email of the User',
  })
  @IsDefined()
  @IsNotEmpty()
  @IsString()
  @IsEmail()
  email: string;

  @ApiProperty({ example: 'true', description: 'The admin status of the User' })
  @IsOptional()
  @Transform((value) => {
    const valueTemp = value && isString(value) ? value.toLowerCase() : value;
    if (isBoolean(valueTemp)) {
      return valueTemp;
    }

    return isString(value) && (value === 'true' || value === '1')
      ? true
      : false;
  })
  @IsBoolean()
  isAdmin: boolean;

  @ApiProperty({
    example: 'Asia/Jakarta',
    description: 'Timezone',
  })
  @IsDefined()
  @IsNotEmpty()
  @IsString()
  @IsTimeZone()
  timezone: string;

  @ApiProperty({ example: 'password', description: 'The password of the User' })
  @IsOptional()
  password?: string;

  @ApiProperty({
    type: ImportantDate,
    isArray: true,
    description: 'An array of important dates with their IDs and dates',
    example: [{ greeting_id: 3, date: '1999-01-01' }],
  })
  @IsArray()
  @IsNotEmpty()
  @ValidateNested({ each: true })
  @Type(() => ImportantDate)
  important_dates: ImportantDate[];
}
