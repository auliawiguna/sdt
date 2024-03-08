import { ApiProperty } from '@nestjs/swagger';
import { IsDefined, IsNotEmpty, IsString } from 'class-validator';

export class CreateGreetingDto {
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
