module.exports = (sequelize, DataTypes) => {
  const Service = sequelize.define('Service', {
    title: DataTypes.STRING,
    fileUrl: DataTypes.STRING,
    date: DataTypes.DATE,
    status: {
      type: DataTypes.ENUM('Can Drive', 'Normal', 'Need to Change'),
      allowNull: false
    },
    vehicleId: DataTypes.INTEGER,
  });

  Service.associate = (models) => {
    Service.belongsTo(models.Vehicle, { foreignKey: 'vehicleId' });
  };

  return Service;
};