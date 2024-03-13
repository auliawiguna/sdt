import {
  AllowNull,
  BelongsTo,
  Column,
  ForeignKey,
  Model,
  Table,
  Scopes,
} from 'sequelize-typescript';
import { User } from './user.model';

@Scopes({
  birthday: {
    where: { type: 'birthday' },
  },
  wedding: {
    where: { type: 'wedding' },
  },
  sent: {
    where: { sent: true },
  },
  unsent: {
    where: { sent: false },
  },
})
@Table({ timestamps: true, tableName: 'user_greetings' })
export class UserGreeting extends Model<UserGreeting> {
  @AllowNull(false)
  @Column
  type: string;

  @AllowNull(false)
  @Column
  year: number;

  @ForeignKey(() => User)
  @Column({ field: 'user_id' })
  user_id: number;

  @AllowNull(false)
  @Column
  greeting: string;

  @Column({ defaultValue: false })
  sent: boolean;

  @BelongsTo(() => User)
  user: User;
}
