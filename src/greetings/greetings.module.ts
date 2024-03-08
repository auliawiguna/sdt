import { Module } from '@nestjs/common';
import { GreetingsService } from './greetings.service';
import { GreetingsController } from './greetings.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { Greeting } from './models/greeting.model';

@Module({
  imports: [SequelizeModule.forFeature([Greeting])],
  controllers: [GreetingsController],
  providers: [GreetingsService],
  exports: [SequelizeModule],
})
export class GreetingsModule {}
