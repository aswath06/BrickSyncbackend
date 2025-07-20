'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Vehicles', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      slNo: {
        type: Sequelize.STRING,
      },
      vehicleNumber: {
        type: Sequelize.STRING,
      },
      driverId: {
        type: Sequelize.STRING,
      },
      insurance: {
        type: Sequelize.DATE,
      },
      permit: {
        type: Sequelize.DATE,
      },
      pollution: {
        type: Sequelize.DATE,
      },
      fitness: {
        type: Sequelize.DATE,
      },
      totalKm: {
        type: Sequelize.INTEGER,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Vehicles');
  },
};
