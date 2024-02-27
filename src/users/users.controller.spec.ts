import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { User } from './models/user.model';
import { UserGreeting } from './models/user-greeting.model';
import { HttpModule } from '@nestjs/axios';
import { getModelToken } from '@nestjs/sequelize';
import { HttpService } from '@nestjs/axios';
import { of } from 'rxjs';

describe('UsersController', () => {
  let controller: UsersController;
  jest.mock('./users.service');

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [HttpModule],
      controllers: [UsersController],
      providers: [
        UsersService,
        {
          provide: getModelToken(User),
          useValue: {
            findOne: jest.fn(),
            create: jest.fn(),
            findAll: jest.fn(),
            findByPk: jest.fn(),
            update: jest.fn(),
            destroy: jest.fn(),
            postGreetings: jest.fn(),
            sendDelayedGreeting: jest.fn(),
            birthdayCron: jest.fn(),
          },
        },
        {
          provide: getModelToken(UserGreeting),
          useValue: {
            scope: jest.fn().mockReturnThis(),
            findAll: jest.fn(),
            findOne: jest.fn(),
            create: jest.fn(),
            update: jest.fn(),
          },
        },
        {
          provide: HttpService,
          useValue: {
            post: jest.fn().mockReturnValue(of({ data: {} })),
          },
        },
      ],
    }).compile();

    controller = module.get<UsersController>(UsersController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
