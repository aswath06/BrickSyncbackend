module.exports = (sequelize, DataTypes) => {
  const Order = sequelize.define('Order', {
    orderId: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    vehicleNumber: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    userId: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    products: {
      type: DataTypes.JSONB,
      allowNull: false,
    },
     status: {
      type: DataTypes.ENUM('assign', 'assigned', 'noted', 'delivered'), // ✅ Added 'noted'
      allowNull: false,
      defaultValue: 'assign',
    },
    image: {
      type: DataTypes.TEXT, // or DataTypes.STRING for just the path/URL
      allowNull: true,
    },
  }, {
    hooks: {
      beforeSave: (order) => {
        if (order.image && order.status !== 'delivered') {
          order.status = 'delivered';
        }
      },
    },
  });

  Order.associate = (models) => {
    Order.belongsTo(models.Vehicle, {
      foreignKey: 'vehicleNumber',
      targetKey: 'vehicleNumber',
    });

    Order.belongsTo(models.User, {
      foreignKey: 'userId',
      targetKey: 'userid',
    });
  };

  return Order;
};
