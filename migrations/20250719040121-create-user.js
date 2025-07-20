'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Users', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      userid: {
        type: Sequelize.STRING
      },
      name: {
        type: Sequelize.STRING
      },
      username: {
        type: Sequelize.STRING
      },
      email: {
        type: Sequelize.STRING
      },
      password: {
        type: Sequelize.STRING
      },
      // Inside up method
phone: {
  type: Sequelize.STRING,
  allowNull: true,
},

      userrole: {
        type: Sequelize.INTEGER
      },
      statements: {
        type: Sequelize.JSON,
        allowNull: true
      },
      
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      },balance: {
  type: Sequelize.FLOAT,
  defaultValue: 0,
},
advance: {
  type: Sequelize.FLOAT,
  defaultValue: 0,
},
dateOfBirth: {
  type: Sequelize.DATEONLY,
  allowNull: true,
},
gender: {
  type: Sequelize.ENUM('Male', 'Female', 'Other'),
  allowNull: true,
},

      
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Users');
  }
};
