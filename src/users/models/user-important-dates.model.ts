import {
  AllowNull,
  BelongsTo,
  Column,
  ForeignKey,
  Model,
  Table,
  Unique,
} from 'sequelize-typescript';
import { User } from './user.model';
import { Greeting } from 'src/greetings/models/greeting.model';

@Table({ timestamps: true, tableName: 'user_important_dates' })
export class UserImportantDate extends Model<UserImportantDate> {
  @Column
  date: Date;

  @Unique('user-important-date-unique')
  @AllowNull(false)
  @Column({ field: 'greeting_id' })
  @ForeignKey(() => Greeting)
  greeting_id: number;

  @Unique('user-important-date-unique')
  @AllowNull(false)
  @Column({ field: 'user_id' })
  @ForeignKey(() => User)
  user_id: number;

  @BelongsTo(() => User)
  users: User[];

  @BelongsTo(() => Greeting)
  greetings: Greeting[];
}
