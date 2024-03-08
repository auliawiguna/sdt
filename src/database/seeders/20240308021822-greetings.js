'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface) {
    await queryInterface.bulkInsert(
      'greetings',
      [
        {
          type: 'birthday',
          greeting:
            'Hey, {NAME} it’s your birthday! I hope you have a great day and get at least half of what you want!',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          type: 'wedding_anniv',
          greeting: 'Hey, {NAME} happy wedding anniversary!',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
      {},
    );
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete('greetings', null, {});
  },
};
