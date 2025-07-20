module.exports = (sequelize, DataTypes) => {
  const Vehicle = sequelize.define('Vehicle', {
    slNo: DataTypes.STRING,
    vehicleNumber: DataTypes.STRING,
    driverId: DataTypes.STRING,
    insurance: DataTypes.DATE,
    permit: DataTypes.DATE,
    pollution: DataTypes.DATE,
    fitness: DataTypes.DATE,
    totalKm: DataTypes.INTEGER,
  });

  Vehicle.associate = (models) => {
    Vehicle.hasMany(models.Service, { foreignKey: 'vehicleId' });
    Vehicle.hasMany(models.Refuel, { foreignKey: 'vehicleId' });
  };

  return Vehicle;
};