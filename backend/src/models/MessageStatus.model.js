// src/models/MessageStatus.model.js
// Auteur : Zahnouni Issam
'use strict';

const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/database');

class MessageStatus extends Model {
  static associate(models) {
    if (models.Messages) MessageStatus.belongsTo(models.Messages, { foreignKey: 'message_id', as: 'message' });
    if (models.Users)    MessageStatus.belongsTo(models.Users,    { foreignKey: 'user_id',    as: 'user'    });
  }
}

MessageStatus.init({
  id:         { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  message_id: { type: DataTypes.INTEGER, allowNull: false },
  user_id:    { type: DataTypes.INTEGER, allowNull: false },
  status:     { type: DataTypes.ENUM('sent','delivered','seen'), allowNull: false, defaultValue: 'sent' },
}, {
  sequelize,
  modelName: 'MessageStatus',
  tableName: 'message_statuses',
  timestamps: true,
  underscored: true,
  indexes: [
    { unique: true, fields: ['message_id', 'user_id'] },
    { fields: ['status'] },
  ],
});

module.exports = MessageStatus;