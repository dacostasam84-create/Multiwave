'use strict';
const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/database');

class CallParticipant extends Model {
  static associate(models) {
    CallParticipant.belongsTo(models.Calls, { foreignKey: 'call_id', as: 'call' });
    CallParticipant.belongsTo(models.Users, { foreignKey: 'user_id', as: 'user' });
  }
}

CallParticipant.init({
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  call_id: { type: DataTypes.INTEGER, allowNull: false },
  user_id: { type: DataTypes.INTEGER, allowNull: false },
  role: { type: DataTypes.ENUM('host', 'guest', 'spectator'), defaultValue: 'guest' },
  joined_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
  left_at: { type: DataTypes.DATE, allowNull: true },
}, {
  sequelize,
  modelName: 'CallParticipant',
  tableName: 'call_participants',
  timestamps: false,
  underscored: true,
});

module.exports = CallParticipant;