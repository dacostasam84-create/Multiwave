'use strict';
const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/database');

class Ads extends Model {
  static associate(models) {
    Ads.belongsTo(models.Users, { foreignKey: 'user_id', as: 'advertiser' });
  }
}

Ads.init({
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  user_id: { type: DataTypes.INTEGER, allowNull: false },
  title: { type: DataTypes.STRING(255), allowNull: false },
  description: { type: DataTypes.TEXT, allowNull: true },
  image_url: { type: DataTypes.STRING(500), allowNull: true },
  link: { type: DataTypes.STRING(500), allowNull: true },
  budget: { type: DataTypes.DECIMAL(10, 2), allowNull: true },
  start_date: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW },
  end_date: { type: DataTypes.DATE, allowNull: true },
  views_count: { type: DataTypes.INTEGER, defaultValue: 0 },
  clicks_count: { type: DataTypes.INTEGER, defaultValue: 0 },
  is_active: { type: DataTypes.BOOLEAN, defaultValue: true },
  status: { type: DataTypes.ENUM('pending', 'active', 'paused', 'ended'), defaultValue: 'pending' },
}, {
  sequelize,
  modelName: 'Ads',
  tableName: 'ads',
  timestamps: true,
  underscored: true,
});

module.exports = Ads;