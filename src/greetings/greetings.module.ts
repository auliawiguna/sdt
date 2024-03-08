import { Module } from '@nestjs/common';
import { GreetingsController } from './greetings.controller';
import { GreetingsService } from './greetings.service';

@Module({
  controllers: [GreetingsController],
  providers: [GreetingsService]
})
export class GreetingsModule {}
