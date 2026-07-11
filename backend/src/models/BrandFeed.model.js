'use strict';
const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/database');

class BrandFeed extends Model {
  static associate(models) {
    BrandFeed.belongsTo(models.Users, { foreignKey: 'user_id', as: 'user' });
  }
}

BrandFeed.init({
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  user_id: { type: DataTypes.INTEGER, allowNull: false },
  brand_id: { type: DataTypes.INTEGER, allowNull: false },
  title: { type: DataTypes.STRING, allowNull: false },
  description: { type: DataTypes.TEXT, allowNull: true },
  media_path: { type: DataTypes.STRING, allowNull: true },
  media_type: { type: DataTypes.ENUM('image', 'video', 'link'), defaultValue: 'image' },
  link_url: { type: DataTypes.STRING, allowNull: true },
  views_count: { type: DataTypes.INTEGER, defaultValue: 0 },
  likes_count: { type: DataTypes.INTEGER, defaultValue: 0 },
  country_target: { type: DataTypes.STRING, allowNull: true },
  is_active: { type: DataTypes.BOOLEAN, defaultValue: true }
}, {
  sequelize,
  modelName: 'BrandFeed',
  tableName: 'brand_feeds',
  timestamps: true,
  underscored: true
});

module.exports = BrandFeed;