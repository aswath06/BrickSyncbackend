module.exports = (sequelize, DataTypes) => {
  const Refuel = sequelize.define('Refuel', {
    amount: DataTypes.FLOAT,
    volume: DataTypes.FLOAT,
    lastKm: DataTypes.INTEGER,
    mileage: DataTypes.FLOAT,
    vehicleId: DataTypes.INTEGER,
  });

  Refuel.associate = (models) => {
    Refuel.belongsTo(models.Vehicle, { foreignKey: 'vehicleId' });
  };

  return Refuel;
};