'use strict';
const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/database');

class Notifications extends Model {
  static associate(models) {
    Notifications.belongsTo(models.Users, { foreignKey: 'user_id', as: 'user' });
    Notifications.belongsTo(models.Users, { foreignKey: 'from_user_id', as: 'from_user' });
  }
}

Notifications.init({
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  user_id: { type: DataTypes.INTEGER, allowNull: false },
  from_user_id: { type: DataTypes.INTEGER, allowNull: true },
  type: { type: DataTypes.ENUM('like', 'comment', 'follow', 'message', 'call', 'debate', 'mention'), allowNull: false },
  content: { type: DataTypes.TEXT, allowNull: true },
  reference_id: { type: DataTypes.INTEGER, allowNull: true },
  reference_type: { type: DataTypes.STRING(50), allowNull: true },
  is_read: { type: DataTypes.BOOLEAN, defaultValue: false },
}, {
  sequelize,
  modelName: 'Notifications',
  tableName: 'notifications',
  timestamps: true,
  underscored: true,
});

module.exports = Notifications;