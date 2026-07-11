'use strict';
const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/database');

class STT extends Model {
  static associate(models) {
    STT.belongsTo(models.Users, { foreignKey: 'user_id', as: 'user' });
  }
}

STT.init({
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  user_id: { type: DataTypes.INTEGER, allowNull: false },
  text: { type: DataTypes.TEXT, allowNull: true },
  translated_text: { type: DataTypes.TEXT, allowNull: true },
  language: { type: DataTypes.STRING(20), allowNull: true },
  target_language: { type: DataTypes.STRING(20), allowNull: true },
  audio_path: { type: DataTypes.STRING(255), allowNull: true },
  room_id: { type: DataTypes.STRING(100), allowNull: true },
  duration: { type: DataTypes.INTEGER, allowNull: true },
}, {
  sequelize,
  modelName: 'STT',
  tableName: 'stt',
  timestamps: true,
  underscored: true,
});

module.exports = STT;