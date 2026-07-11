'use strict';
const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/database');
class Orders extends Model {
  static associate(models) {
    Orders.belongsTo(models.Users, { foreignKey: 'user_id', as: 'buyer' });
    Orders.belongsTo(models.Products, { foreignKey: 'product_id', as: 'product' });
  }
}
Orders.init({
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  user_id: { type: DataTypes.INTEGER, allowNull: false },
  product_id: { type: DataTypes.INTEGER, allowNull: false },
  quantity: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 1 },
  unit_price: { type: DataTypes.DECIMAL(10, 2), allowNull: false },
  total_price: { type: DataTypes.DECIMAL(10, 2), allowNull: false },
  discount: { type: DataTypes.DECIMAL(10, 2), defaultValue: 0 },
  shipping_cost: { type: DataTypes.DECIMAL(10, 2), defaultValue: 0 },
  status: { type: DataTypes.ENUM('pending', 'confirmed', 'processing', 'shipped', 'delivered', 'completed', 'cancelled', 'refunded'), defaultValue: 'pending' },
  payment_method: { type: DataTypes.ENUM('card', 'paypal', 'wallet', 'cash', 'crypto'), allowNull: true },
  payment_status: { type: DataTypes.ENUM('unpaid', 'paid', 'refunded'), defaultValue: 'unpaid' },
  delivery_address: { type: DataTypes.TEXT, allowNull: true },
  tracking_number: { type: DataTypes.STRING(100), allowNull: true },
  estimated_delivery: { type: DataTypes.DATE, allowNull: true },
  delivered_at: { type: DataTypes.DATE, allowNull: true },
  notes: { type: DataTypes.TEXT, allowNull: true },
  review: { type: DataTypes.TEXT, allowNull: true },
  rating: { type: DataTypes.INTEGER, allowNull: true },
}, {
  sequelize,
  modelName: 'Orders',
  tableName: 'orders',
  timestamps: true,
  underscored: true,
});
module.exports = Orders;
