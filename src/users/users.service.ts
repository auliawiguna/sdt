import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { User } from './models/user.model';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import * as moment from 'moment-timezone';
import { Op, Sequelize } from 'sequelize';
import { Cron, CronExpression } from '@nestjs/schedule';
import { UserGreeting } from './models/user-greeting.model';
import { HttpService } from '@nestjs/axios';
import { lastValueFrom } from 'rxjs';
import { AxiosResponse } from 'axios';
import { map } from 'rxjs/operators';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User)
    private readonly userModel: typeof User,
    @InjectModel(UserGreeting)
    private readonly userGreeting: typeof UserGreeting,
    private readonly httpService: HttpService,
  ) {}

  async create(payload: CreateUserDto): Promise<User> {
    const user = await this.userModel.findOne({
      where: { email: payload.email },
    });
    if (user) {
      throw new HttpException('User already exists', HttpStatus.BAD_REQUEST);
    }
    return this.userModel.create(payload);
  }

  async findAll(): Promise<User[]> {
    return this.userModel.findAll();
  }

  async findOne(id: string): Promise<User> {
    return this.userModel.findOne({ where: { id } });
  }

  async update(id: string, payload: UpdateUserDto): Promise<User> {
    const user = await this.userModel.findByPk(id);
    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }
    return user.update(payload);
  }

  async remove(id: string): Promise<void> {
    const user = await this.userModel.findByPk(id);
    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }
    return user.destroy();
  }

  private async postGreeting({
    email,
    message,
  }: {
    email: string;
    message: string;
  }): Promise<{ status?: string; sentTime?: Date | string }> {
    const responseData = await lastValueFrom(
      this.httpService
        .post('https://email-service.digitalenvision.com.au/send-email', {
          email,
          message,
        })
        .pipe(
          map((response: AxiosResponse) => {
            return response.data;
          }),
        ),
    );

    return responseData;
  }

  @Cron(CronExpression.EVERY_12_HOURS)
  async sendDelayedGreeting() {
    const unsentGreetings = await this.userGreeting
      .scope(['birthday', 'unsent'])
      .findAll({
        include: [
          {
            model: User,
            attributes: ['email', 'id'],
          },
        ],
      });

    if (unsentGreetings.length) {
      unsentGreetings.forEach(async (unsentGreeting) => {
        if (unsentGreeting?.user?.email) {
          console.log(
            'UsersService ~ sendDelayedGreeting ~ unsentGreetings ~ Send the message to:',
            unsentGreeting.user.email,
          );
          const sent = await this.triggerSendEmail({
            email: unsentGreeting.user.email,
            name: unsentGreeting.user?.name,
          });

          unsentGreeting.update({ sent });
        }
      });
    }
  }

  @Cron(CronExpression.EVERY_HOUR)
  async birthdayCron() {
    const now = new Date('2024-04-18');
    const usersWithTodayBirthday = await User.findAll({
      where: {
        [Op.and]: [
          Sequelize.where(
            Sequelize.fn('DATE_FORMAT', Sequelize.literal('dob'), '%m-%d'),
            Sequelize.fn('DATE_FORMAT', now, '%m-%d'),
          ),
        ],
      },
    });

    const usersWithCorrectTimezone = usersWithTodayBirthday.filter((user) => {
      return this.isNineAMInUserTimezone(user.timezone);
    });
    // const usersWithCorrectTimezone = usersWithTodayBirthday;

    console.log('Users with birthday today at 9 AM:', usersWithCorrectTimezone);

    // Send email to usersWithCorrectTimezone
    // Put to the user greetings table
    if (usersWithCorrectTimezone.length) {
      usersWithCorrectTimezone.forEach(async (user) => {
        const birthdayGreetings = await this.userGreeting
          .scope('birthday')
          .findOne({
            where: { user_id: user.id, year: now.getFullYear() },
          });
        if (!birthdayGreetings) {
          const sent = await this.triggerSendEmail({
            email: user.email,
            name: user.name,
          });

          await this.userGreeting.create({
            type: 'birthday',
            user_id: user.id,
            year: now.getFullYear(),
            sent,
          });
        }
      });
    }
  }

  private isNineAMInUserTimezone(timezone: string): boolean {
    const nineAMInUserTimezone = moment
      .tz(timezone)
      .set({ hour: 9, minute: 0, second: 0, millisecond: 0 });
    const nowInUserTimezone = moment.tz(timezone);

    return nowInUserTimezone.isSame(nineAMInUserTimezone, 'minute');
  }

  private async triggerSendEmail({
    email,
    name,
  }: {
    email: string;
    name: string;
  }): Promise<boolean> {
    const hitSdtService = await this.postGreeting({
      email: email,
      message: `Hey, ${name} it’s your birthday`,
    });

    return !!(hitSdtService.status && hitSdtService.status === 'sent');
  }
}
