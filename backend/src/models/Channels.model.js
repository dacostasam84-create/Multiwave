'use strict';
const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/database');

class Channel extends Model {
  static associate(models) {
    Channel.belongsTo(models.Users, { foreignKey: 'owner_id', as: 'owner' });
    Channel.belongsToMany(models.Users, {
      through: 'channel_members',
      as: 'members',
      foreignKey: 'channel_id',
      otherKey: 'user_id',
      timestamps: false
    });
  }
}

Channel.init({
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  name: { type: DataTypes.STRING(120), allowNull: false, unique: true },
  description: { type: DataTypes.TEXT, allowNull: true },
  avatar: { type: DataTypes.STRING(255), allowNull: true },
  type: { type: DataTypes.ENUM('broadcast', 'ai', 'debate', 'news'), defaultValue: 'broadcast' },
  owner_id: { type: DataTypes.INTEGER, allowNull: false },
  subscribers_count: { type: DataTypes.INTEGER, defaultValue: 0 },
  is_verified: { type: DataTypes.BOOLEAN, defaultValue: false },
  ai_moderation: { type: DataTypes.BOOLEAN, defaultValue: true },
  status: { type: DataTypes.ENUM('active', 'suspended', 'archived'), defaultValue: 'active' },
}, {
  sequelize,
  modelName: 'Channel',
  tableName: 'channels',
  timestamps: true,
  underscored: true,
});

module.exports = Channel;