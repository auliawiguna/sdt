import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import {
  IsBoolean,
  IsDate,
  IsDefined,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsEmail,
} from 'class-validator';
import { isBoolean, isString } from 'lodash';

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

  @ApiProperty({ example: 'password', description: 'The password of the User' })
  @IsOptional()
  password?: string;

  @ApiProperty({
    example: '1999-12-31',
    description: 'The date of birth of the User',
  })
  @IsDate()
  dob: Date;
}
