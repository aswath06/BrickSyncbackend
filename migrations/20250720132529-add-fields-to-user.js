'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('Users', 'balance', {
      type: Sequelize.FLOAT,
      defaultValue: 0,
    });

    await queryInterface.addColumn('Users', 'advance', {
      type: Sequelize.FLOAT,
      defaultValue: 0,
    });

    await queryInterface.addColumn('Users', 'dateOfBirth', {
      type: Sequelize.DATEONLY,
      allowNull: true,
    });

    await queryInterface.addColumn('Users', 'gender', {
      type: Sequelize.ENUM('Male', 'Female', 'Other'),
      allowNull: true,
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn('Users', 'balance');
    await queryInterface.removeColumn('Users', 'advance');
    await queryInterface.removeColumn('Users', 'dateOfBirth');
    await queryInterface.removeColumn('Users', 'gender');
  }
};
