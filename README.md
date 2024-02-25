# Summary

## Users Endpoints:
![image](https://github.com/auliawiguna/sdt/assets/26473549/f2c258fc-010e-4c51-ac50-c707b22493cb)
  - **POST**: Adds a new user with email validation.
  - **PUT**: Updates an existing user.
  - **DELETE**: Removes an existing user.
  - **/users/test-birthday**: A tool for testing the cron job that triggers new birthday greetings.
  - **/users/test-resend-greetings**: A tool for testing the cron job that resends delayed greeting emails.

## Logic:
  - A cron job (`src/users/users.service.ts` - `birthdayCron`) runs every hour to handle happy birthday greetings. It queries users who have a birthday on the current day at 9 am in their timezone. This ensures that the job is executed multiple times a day, minimizing the chance of missing anyone.
  - A separate cron job (`src/users/users.service.ts` - `sendDelayedGreeting`) runs every 12 hours to resend delayed greetings from the current year. If the resend fails, the cron will attempt to resend it in the next 12 hours.

## Test Plan
### Manual Testing:
  - Preferably use MySQL as the RDBMS.
  - Copy `.env.example` to `.env` and customize it for your workstation.
  - Run `nvm use` to ensure the correct Node.js version.
  - Run `npm i`.
  - Run `npm run start:dev` to launch the development environment.
  - Sequelize ORM handles table migrations. It will migrate tables on the first start, and you can create additional migrations as needed.
  - Open [http://127.0.0.1:3000/api/v1/api-docs#](http://127.0.0.1:3000/api/v1/api-docs#) to access the Swagger API docs.

### Unit Test:
  - Copy `.env.example` to `.env` and customize it for your workstation.
  - Run `nvm use` to ensure the correct Node.js version.
  - Run `npm i`.
  - Run `npm run test` to execute unit tests and possibly E2E tests.
