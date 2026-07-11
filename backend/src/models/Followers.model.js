'use strict';
const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/database');

class Followers extends Model {
  static associate(models) {
    Followers.belongsTo(models.Users, { foreignKey: 'follower_id', as: 'follower' });
    Followers.belongsTo(models.Users, { foreignKey: 'followed_id', as: 'followed' });
  }
}

Followers.init({
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  follower_id: { type: DataTypes.INTEGER, allowNull: false },
  followed_id: { type: DataTypes.INTEGER, allowNull: false },
  status: { type: DataTypes.ENUM('pending', 'accepted', 'blocked'), defaultValue: 'accepted' },
}, {
  sequelize,
  modelName: 'Followers',
  tableName: 'followers',
  timestamps: true,
  underscored: true,
});

module.exports = Followers;