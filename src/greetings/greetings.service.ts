import { Injectable, HttpStatus, HttpException } from '@nestjs/common';
import { CreateGreetingDto } from './dto/create-greeting.dto';
import { UpdateGreetingDto } from './dto/update-greeting.dto';
import { InjectModel } from '@nestjs/sequelize';
import { Greeting } from './models/greeting.model';

@Injectable()
export class GreetingsService {
  constructor(
    @InjectModel(Greeting)
    private readonly greetingModel: typeof Greeting,
  ) {}

  async create(payload: CreateGreetingDto): Promise<Greeting> {
    const greeting = await this.greetingModel.findOne({
      where: { type: payload.type },
    });
    if (greeting) {
      throw new HttpException(
        'Greeting already exists',
        HttpStatus.BAD_REQUEST,
      );
    }
    return this.greetingModel.create(payload);
  }

  async findAll(): Promise<Greeting[]> {
    return this.greetingModel.findAll();
  }

  async findOne(id: string): Promise<Greeting> {
    return this.greetingModel.findOne({ where: { id } });
  }

  async update(id: string, payload: UpdateGreetingDto): Promise<Greeting> {
    const greeting = await this.greetingModel.findByPk(id);
    if (!greeting) {
      throw new HttpException('Greeting not found', HttpStatus.NOT_FOUND);
    }
    return greeting.update(payload);
  }

  async remove(id: string): Promise<void> {
    const greeting = await this.greetingModel.findByPk(id);
    if (!greeting) {
      throw new HttpException('Greeting not found', HttpStatus.NOT_FOUND);
    }
    return greeting.destroy();
  }
}
