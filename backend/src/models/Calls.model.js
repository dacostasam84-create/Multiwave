'use strict';
const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/database');

class Calls extends Model {
  static associate(models) {
    Calls.belongsTo(models.Users, { foreignKey: 'caller_id', as: 'caller' });
    Calls.belongsTo(models.Users, { foreignKey: 'receiver_id', as: 'receiver' });
  }
}

Calls.init({
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  caller_id: { type: DataTypes.INTEGER, allowNull: false },
  receiver_id: { type: DataTypes.INTEGER, allowNull: true },
  room_id: { type: DataTypes.STRING(100), allowNull: false },
  type: { type: DataTypes.ENUM('audio', 'video', 'debate'), defaultValue: 'video' },
  status: { type: DataTypes.ENUM('pending', 'active', 'ended', 'missed', 'rejected'), defaultValue: 'pending' },
  started_at: { type: DataTypes.DATE, allowNull: true },
  ended_at: { type: DataTypes.DATE, allowNull: true },
  duration: { type: DataTypes.INTEGER, allowNull: true },
  recording_url: { type: DataTypes.STRING(255), allowNull: true },
}, {
  sequelize,
  modelName: 'Calls',
  tableName: 'calls',
  timestamps: true,
  underscored: true,
});

module.exports = Calls;