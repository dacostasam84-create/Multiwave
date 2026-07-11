'use strict';
const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/database');
class Products extends Model {
  static associate(models) {
    Products.belongsTo(models.Users, { foreignKey: 'user_id', as: 'seller' });
    Products.hasMany(models.Orders, { foreignKey: 'product_id', as: 'orders' });
  }
}
Products.init({
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  user_id: { type: DataTypes.INTEGER, allowNull: false },
  name: { type: DataTypes.STRING(150), allowNull: false },
  description: { type: DataTypes.TEXT, allowNull: true },
  price: { type: DataTypes.DECIMAL(10, 2), allowNull: false },
  compare_price: { type: DataTypes.DECIMAL(10, 2), allowNull: true },
  stock: { type: DataTypes.INTEGER, defaultValue: 0 },
  category: { type: DataTypes.STRING(100), allowNull: true },
  subcategory: { type: DataTypes.STRING(100), allowNull: true },
  brand: { type: DataTypes.STRING(100), allowNull: true },
  image_url: { type: DataTypes.STRING(255), allowNull: true },
  images: { type: DataTypes.JSON, allowNull: true },
  rating: { type: DataTypes.DECIMAL(3, 2), defaultValue: 0 },
  reviews_count: { type: DataTypes.INTEGER, defaultValue: 0 },
  sales_count: { type: DataTypes.INTEGER, defaultValue: 0 },
  views_count: { type: DataTypes.INTEGER, defaultValue: 0 },
  is_digital: { type: DataTypes.BOOLEAN, defaultValue: false },
  is_featured: { type: DataTypes.BOOLEAN, defaultValue: false },
  delivery_info: { type: DataTypes.STRING(255), allowNull: true },
  location: { type: DataTypes.STRING(100), allowNull: true },
  currency: { type: DataTypes.STRING(10), defaultValue: 'USD' },
  status: { type: DataTypes.ENUM('active', 'inactive', 'archived', 'sold_out'), defaultValue: 'active' },
}, {
  sequelize,
  modelName: 'Products',
  tableName: 'products',
  timestamps: true,
  underscored: true,
});
module.exports = Products;
