import { ApiProperty } from '@nestjs/swagger';
import { IsDefined, IsNotEmpty, IsString } from 'class-validator';

import { PartialType } from '@nestjs/swagger';
import { CreateGreetingDto } from './create-greeting.dto';

export class UpdateGreetingDto extends PartialType(CreateGreetingDto) {
  @ApiProperty({ example: 'birthday', description: 'The type of the greeting' })
  @IsString()
  type: string;

  @ApiProperty({
    example: 'Happy holiyay!',
    description: 'Greeting',
  })
  @IsDefined()
  @IsNotEmpty()
  @IsString()
  greeting: string;
}
