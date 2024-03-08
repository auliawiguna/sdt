import { IsDate, IsNotEmpty } from 'class-validator';

export class ImportantDate {
  @IsNotEmpty()
  greeting_id: number;

  @IsNotEmpty()
  @IsDate()
  date: Date;
}
