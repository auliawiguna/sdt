import {
  AllowNull,
  Column,
  Model,
  Table,
  Unique,
  Scopes,
} from 'sequelize-typescript';

@Scopes({
  birthday: {
    where: { type: 'birthday' },
  },
  wedding: {
    where: { type: 'wedding_anniv' },
  },
})
@Table({ timestamps: true, tableName: 'greetings' })
export class Greeting extends Model<Greeting> {
  @Unique
  @AllowNull(false)
  @Column
  type: string;

  @AllowNull(false)
  @Column
  greeting: string;
}
