'use strict';
const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/database');

class Whisper extends Model {
  static associate(models) {
    Whisper.belongsTo(models.Users, { foreignKey: 'sender_id', as: 'sender' });
    Whisper.belongsTo(models.Users, { foreignKey: 'receiver_id', as: 'receiver' });
  }
}

Whisper.init({
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  sender_id: { type: DataTypes.INTEGER, allowNull: false },
  receiver_id: { type: DataTypes.INTEGER, allowNull: false },
  message: { type: DataTypes.TEXT, allowNull: false },
  translated_message: { type: DataTypes.TEXT, allowNull: true },
  language: { type: DataTypes.STRING(10), allowNull: true },
  is_read: { type: DataTypes.BOOLEAN, defaultValue: false },
  ephemeral: { type: DataTypes.BOOLEAN, defaultValue: true },
  expires_at: { type: DataTypes.DATE, allowNull: true },
}, {
  sequelize,
  modelName: 'Whisper',
  tableName: 'whispers',
  timestamps: true,
  underscored: true,
});

module.exports = Whisper;