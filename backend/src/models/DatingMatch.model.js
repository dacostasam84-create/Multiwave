'use strict';
const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/database');

class DatingMatch extends Model {
  static associate(models) {
    DatingMatch.belongsTo(models.Users, { foreignKey: 'user_id', as: 'user' });
    DatingMatch.belongsTo(models.Users, { foreignKey: 'target_id', as: 'target' });
  }
}

DatingMatch.init({
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  user_id: { type: DataTypes.INTEGER, allowNull: false },
  target_id: { type: DataTypes.INTEGER, allowNull: false },
  status: { type: DataTypes.ENUM('liked','passed','matched'), defaultValue: 'liked' }
}, {
  sequelize,
  modelName: 'DatingMatch',
  tableName: 'dating_matches',
  timestamps: true,
  underscored: true
});

module.exports = DatingMatch;