'use strict';
const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/database');

class Images extends Model {
  static associate(models) {
    Images.belongsTo(models.Users, { foreignKey: 'user_id', as: 'user' });
  }
}

Images.init({
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  user_id: { type: DataTypes.INTEGER, allowNull: false },
  filename: { type: DataTypes.STRING(255), allowNull: false },
  path: { type: DataTypes.STRING(500), allowNull: false },
  size: { type: DataTypes.BIGINT, allowNull: true },
  mimetype: { type: DataTypes.STRING(100), allowNull: true },
  width: { type: DataTypes.INTEGER, allowNull: true },
  height: { type: DataTypes.INTEGER, allowNull: true },
  is_avatar: { type: DataTypes.BOOLEAN, defaultValue: false },
}, {
  sequelize,
  modelName: 'Images',
  tableName: 'images',
  timestamps: true,
  underscored: true,
});

module.exports = Images;