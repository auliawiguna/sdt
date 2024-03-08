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
import { ApiTags } from '@nestjs/swagger';
import { GreetingsService } from './greetings.service';
import { CreateGreetingDto } from './dto/create-greeting.dto';
import { UpdateGreetingDto } from './dto/update-greeting.dto';

@ApiTags('greetings')
@Controller('greetings')
export class GreetingsController {
  constructor(private readonly greetingsService: GreetingsService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() payload: CreateGreetingDto) {
    return this.greetingsService.create(payload);
  }

  @Get()
  @HttpCode(HttpStatus.ACCEPTED)
  findAll() {
    return this.greetingsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.greetingsService.findOne(id);
  }

  @Put(':id')
  update(
    @Param('id') id: string,
    @Body() updateGreetingDto: UpdateGreetingDto,
  ) {
    return this.greetingsService.update(id, updateGreetingDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.greetingsService.remove(id);
  }
}
