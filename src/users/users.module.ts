import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { User } from './models/user.model';
import { SequelizeModule } from '@nestjs/sequelize';
import { UserGreeting } from './models/user-greeting.model';
import { HttpModule } from '@nestjs/axios';
import { Greeting } from 'src/greetings/models/greeting.model';
import { GreetingsModule } from 'src/greetings/greetings.module';
import { UserImportantDate } from './models/user-important-dates.model';

@Module({
  imports: [
    HttpModule,
    SequelizeModule.forFeature([
      User,
      UserGreeting,
      Greeting,
      UserImportantDate,
    ]),
    GreetingsModule,
  ],
  providers: [UsersService],
  controllers: [UsersController],
  exports: [SequelizeModule],
})
export class UsersModule {}
