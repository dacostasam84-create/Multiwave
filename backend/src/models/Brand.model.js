// src/models/Brand.model.js
// Auteur : Zahnouni Issam
'use strict';

const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/database');

class Brand extends Model {
  static associate(models) {
    Brand.belongsTo(models.Users, { foreignKey: 'user_id', as: 'owner' });
    Brand.hasMany(models.BrandFeed, { foreignKey: 'brand_id', as: 'feeds' });
  }
}

Brand.init({
  id:              { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  user_id:         { type: DataTypes.INTEGER, allowNull: false },
  name:            { type: DataTypes.STRING(150), allowNull: false },
  description:     { type: DataTypes.TEXT, allowNull: true },
  logo_url:        { type: DataTypes.STRING(255), allowNull: true },
  website:         { type: DataTypes.STRING(255), allowNull: true },
  category:        { type: DataTypes.STRING(100), allowNull: true },
  country:         { type: DataTypes.STRING(100), allowNull: true },
  followers_count: { type: DataTypes.INTEGER, defaultValue: 0 },
  is_verified:     { type: DataTypes.BOOLEAN, defaultValue: false },
  is_active:       { type: DataTypes.BOOLEAN, defaultValue: true },
}, {
  sequelize,
  modelName: 'Brand',
  tableName: 'brands',
  timestamps: true,
  underscored: true,
});

module.exports = Brand;