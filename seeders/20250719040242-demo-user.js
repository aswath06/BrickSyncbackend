'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert('Users', [{
      userid: 'USR001',
      name: 'Aswath M',
      username: 'aswath123',
      email: 'aswath@example.com',
      password: 'secret', // Ideally, hash this
      userrole: 2,
      statements: JSON.stringify([
        { date: '2025-07-19', action: 'login', status: 'success' },
        { date: '2025-07-19', action: 'upload', file: 'report.pdf' }
      ]),
      createdAt: new Date(),
      updatedAt: new Date()
    }], {});
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Users', null, {});
  }
};
