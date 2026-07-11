'use strict';
const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/database');

class Messages extends Model {
  static associate(models) {
    Messages.belongsTo(models.Users, { foreignKey: 'sender_id', as: 'sender' });
    Messages.belongsTo(models.Users, { foreignKey: 'receiver_id', as: 'receiver' });
  }
}

Messages.init({
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  sender_id: { type: DataTypes.INTEGER, allowNull: false },
  receiver_id: { type: DataTypes.INTEGER, allowNull: true },
  group_id: { type: DataTypes.INTEGER, allowNull: true },
  content: { type: DataTypes.TEXT, allowNull: true },
  translated_content: { type: DataTypes.TEXT, allowNull: true },
  original_language: { type: DataTypes.STRING(10), allowNull: true },
  media_url: { type: DataTypes.STRING(255), allowNull: true },
  media_type: { type: DataTypes.ENUM('text', 'image', 'video', 'audio', 'file'), defaultValue: 'text' },
  is_read: { type: DataTypes.BOOLEAN, defaultValue: false },
  is_deleted: { type: DataTypes.BOOLEAN, defaultValue: false },
}, {
  sequelize,
  modelName: 'Messages',
  tableName: 'messages',
  timestamps: true,
  underscored: true,
});

module.exports = Messages;