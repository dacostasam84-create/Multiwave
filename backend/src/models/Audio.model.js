'use strict';
const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/database');

class Audio extends Model {
  static associate(models) {
    Audio.belongsTo(models.Users, { foreignKey: 'user_id', as: 'user' });
  }
}

Audio.init({
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  user_id: { type: DataTypes.INTEGER, allowNull: false },
  filename: { type: DataTypes.STRING(255), allowNull: false },
  path: { type: DataTypes.STRING(255), allowNull: false },
  duration: { type: DataTypes.INTEGER, allowNull: true },
  size: { type: DataTypes.BIGINT, allowNull: true },
  mimetype: { type: DataTypes.STRING(100), allowNull: true },
  transcription: { type: DataTypes.TEXT, allowNull: true },
  language: { type: DataTypes.STRING(10), allowNull: true },
}, {
  sequelize,
  modelName: 'Audio',
  tableName: 'audios',
  timestamps: true,
  underscored: true,
});

module.exports = Audio;