import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { getModelToken } from '@nestjs/sequelize';
import { User } from './models/user.model';
import { UserGreeting } from './models/user-greeting.model';
import { HttpService } from '@nestjs/axios';
import { of } from 'rxjs';
import { CreateUserDto } from './dto/create-user.dto';

describe('UsersService', () => {
  let service: UsersService;
  let userModel: typeof User;
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  let userGreetingModel: typeof UserGreeting;
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  let httpService: HttpService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
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

    service = module.get<UsersService>(UsersService);
    userModel = module.get<typeof User>(getModelToken(User));
    userGreetingModel = module.get<typeof UserGreeting>(
      getModelToken(UserGreeting),
    );
    httpService = module.get<HttpService>(HttpService);
  });

  it('should be defined', () => {
    // Assert
    expect(service).toBeDefined();
  });

  describe('create', () => {
    const payload: CreateUserDto = {
      email: 'test@example.com',
      name: 'John Wick',
      dob: new Date('1990-01-01'),
      timezone: 'America/New_York',
      isAdmin: false,
    };

    it('should create a new user', async () => {
      // Arrange
      const user = { id: 1, ...payload };

      jest.spyOn(userModel, 'findOne').mockResolvedValue(null);
      jest.spyOn(userModel, 'create').mockResolvedValue(user);

      // Act
      const result = await service.create(payload);

      // Assert
      expect(userModel.findOne).toHaveBeenCalledWith({
        where: { email: payload.email },
      });
      expect(userModel.create).toHaveBeenCalledWith(payload);
      expect(result).toEqual(user);
    });

    it('should throw an error if user already exists', async () => {
      // Arrange
      const existingUser = { id: 1, password: 'pass', ...payload } as User;

      // Act
      jest.spyOn(userModel, 'findOne').mockResolvedValue(existingUser);

      // Assert
      await expect(service.create(payload)).rejects.toThrowError(
        'User already exists',
      );
    });
  });

  describe('findAll', () => {
    it('should return all users', async () => {
      // Arrange
      const users = [
        {
          id: 1,
          password: 'pass',
          email: 'test@example.com',
          name: 'John Wick',
          dob: new Date('1990-01-01'),
          timezone: 'America/New_York',
          isAdmin: false,
        },
      ] as User[];

      // Act
      jest.spyOn(userModel, 'findAll').mockResolvedValue(users);

      const result = await service.findAll();

      // Assert
      expect(userModel.findAll).toHaveBeenCalled();
      expect(result).toEqual(users);
    });
  });

  describe('findOne', () => {
    it('should return a user by id', async () => {
      // Arrange
      const id = '1';
      const user = {
        id: 1,
        password: 'pass',
        email: 'test@example.com',
        name: 'John Wick',
        dob: new Date('1990-01-01'),
        timezone: 'America/New_York',
        isAdmin: false,
      } as User;
      jest.spyOn(userModel, 'findOne').mockResolvedValue(user);

      // Act
      const result = await service.findOne(id);

      // Assert
      expect(userModel.findOne).toHaveBeenCalledWith({ where: { id } });
      expect(result).toEqual(user);
    });
  });

  describe('isNineAMInUserTimezone', () => {
    it('should return false if it is not 9 AM in the user timezone', () => {
      const timezone = 'America/New_York';
      jest.spyOn(Date.prototype, 'getTimezoneOffset').mockReturnValue(-300);

      const result = service.isNineAMInUserTimezone(timezone);

      expect(result).toBe(false);
    });
  });

  describe('triggerSendEmail', () => {
    it('should trigger sending an email and return true if successful', async () => {
      const email = 'test@example.com';
      const name = 'John Doe';
      const responseData = { status: 'sent' };
      jest.spyOn(service, 'postGreeting').mockResolvedValue(responseData);

      const result = await service.triggerSendEmail({ email, name });

      expect(service.postGreeting).toHaveBeenCalledWith({
        email,
        message: `Hey, ${name} it’s your birthday`,
      });
      expect(result).toBe(true);
    });

    it('should trigger sending an email and return false if unsuccessful', async () => {
      const email = 'test@example.com';
      const name = 'John Doe';
      const responseData = {};
      jest.spyOn(service, 'postGreeting').mockResolvedValue(responseData);

      const result = await service.triggerSendEmail({ email, name });

      expect(service.postGreeting).toHaveBeenCalledWith({
        email,
        message: `Hey, ${name} it’s your birthday`,
      });
      expect(result).toBe(false);
    });
  });
});
