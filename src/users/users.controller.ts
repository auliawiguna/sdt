import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { ApiTags } from '@nestjs/swagger';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './models/user.model';

@ApiTags('users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('/test-birthday')
  @HttpCode(HttpStatus.CREATED)
  testBirthDay() {
    return this.usersService.birthdayCron();
  }

  @Get('/test-resend-greetings')
  @HttpCode(HttpStatus.CREATED)
  testSendDelayedGreeting() {
    return this.usersService.sendDelayedGreeting();
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() payload: CreateUserDto) {
    return this.usersService.create(payload);
  }

  @Put(':id')
  @HttpCode(HttpStatus.ACCEPTED)
  update(
    @Param('id') id: string,
    @Body() payload: UpdateUserDto,
  ): Promise<User> {
    return this.usersService.update(id, payload);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.ACCEPTED)
  delete(@Param('id') id: string) {
    return this.usersService.remove(id);
  }
}
