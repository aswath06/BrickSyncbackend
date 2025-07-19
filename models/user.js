'use strict';

module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    userid: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    name: DataTypes.STRING,
    username: DataTypes.STRING,
    email: {
      type: DataTypes.STRING,
      unique: true
    },
    password: DataTypes.STRING,
    userrole: DataTypes.INTEGER,
    phone: {
      type: DataTypes.STRING,
      allowNull: true
    },
    statements: {
      type: DataTypes.JSON,
      allowNull: true
    }
  });

  return User;
};
