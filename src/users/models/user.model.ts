import {
  AllowNull,
  BeforeCreate,
  BeforeUpdate,
  Column,
  HasMany,
  Model,
  Table,
  Unique,
} from 'sequelize-typescript';
import { generateHash } from './../../helpers/hash';
import { UserGreeting } from './user-greeting.model';
import { UserImportantDate } from './user-important-dates.model';

@Table({ timestamps: true, tableName: 'users' })
export class User extends Model<User> {
  @Column
  name: string;

  @Unique
  @AllowNull(false)
  @Column
  email: string;

  @Column({ field: 'is_admin', defaultValue: false })
  isAdmin: boolean;

  @Column
  password: string;

  @Column
  timezone: string;

  @AllowNull(true)
  @Column
  dob: Date;

  @HasMany(() => UserGreeting)
  greetings: UserGreeting[];

  @HasMany(() => UserImportantDate)
  important_dates: UserImportantDate[];

  @BeforeCreate
  static hashPassword(instance: User) {
    if (instance.password) {
      instance.password = generateHash(instance.password);
    }
  }

  @BeforeUpdate
  static hashPasswordIfNeeded(instance: User) {
    if (instance.password !== (instance as any)._previousDataValues.password) {
      instance.password = generateHash(instance.password);
    }
  }
}
