'use strict';
const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/database');

class Groups extends Model {
  static associate(models) {
    Groups.belongsTo(models.Users, { foreignKey: 'owner_id', as: 'owner' });
    Groups.hasMany(models.Messages, { foreignKey: 'group_id', as: 'messages' });
  }
}

Groups.init({
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  name: { type: DataTypes.STRING(120), allowNull: false },
  slug: { type: DataTypes.STRING(150), allowNull: false, unique: true },
  description: { type: DataTypes.TEXT, allowNull: true },
  owner_id: { type: DataTypes.INTEGER, allowNull: false },
  avatar: { type: DataTypes.STRING(255), allowNull: true },
  visibility: { type: DataTypes.ENUM('public', 'private', 'restricted'), defaultValue: 'public' },
  ai_moderation: { type: DataTypes.BOOLEAN, defaultValue: true },
  is_verified: { type: DataTypes.BOOLEAN, defaultValue: false },
  members_count: { type: DataTypes.INTEGER, defaultValue: 0 },
  status: { type: DataTypes.ENUM('active', 'archived', 'suspended'), defaultValue: 'active' },
}, {
  sequelize,
  modelName: 'Groups',
  tableName: 'groups',
  timestamps: true,
  underscored: true,
});

module.exports = Groups;