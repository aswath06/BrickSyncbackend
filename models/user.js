'use strict';

module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    userid: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    name: DataTypes.STRING,
    username: DataTypes.STRING,
    email: {
      type: DataTypes.STRING,
      unique: true,
    },
    password: DataTypes.STRING,
    userrole: DataTypes.INTEGER,
    phone: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    balance: {
      type: DataTypes.FLOAT,
      defaultValue: 0,
    },
    advance: {
      type: DataTypes.FLOAT,
      defaultValue: 0,
    },
    dateOfBirth: {
      type: DataTypes.DATEONLY,
      allowNull: true,
    },
    gender: {
      type: DataTypes.ENUM('Male', 'Female', 'Other'),
      allowNull: true,
    },
    statements: {
      type: DataTypes.JSON, // Array of objects: [{ modeOfPayment, amount, date }]
      allowNull: true,
    },
  });

  return User;
};
