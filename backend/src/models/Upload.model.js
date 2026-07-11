'use strict';
const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/database');
class Upload extends Model {}
Upload.init({
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  user_id: { type: DataTypes.INTEGER, allowNull: false },
  filename: { type: DataTypes.STRING(255), allowNull: false },
  file_type: { type: DataTypes.STRING(50), allowNull: false },
  path: { type: DataTypes.STRING(255), allowNull: false },
  size: { type: DataTypes.INTEGER, allowNull: false },
  mimetype: { type: DataTypes.STRING(100), allowNull: false },
}, {
  sequelize,
  modelName: 'Upload',
  tableName: 'uploads',
  timestamps: true,
  underscored: true,
});
module.exports = Upload;
