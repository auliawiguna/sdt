import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { User } from './models/user.model';
import { SequelizeModule } from '@nestjs/sequelize';
import { UserGreeting } from './models/user-greeting.model';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [HttpModule, SequelizeModule.forFeature([User, UserGreeting])],
  providers: [UsersService],
  controllers: [UsersController],
  exports: [SequelizeModule],
})
export class UsersModule {}
