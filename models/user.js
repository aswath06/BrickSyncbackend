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
    userrole: DataTypes.INTEGER
  }, {});
  return User;
};
