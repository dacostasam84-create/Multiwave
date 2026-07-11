// src/models/Webrtc.model.js
// Auteur : Zahnouni Issam
'use strict';

const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/database');

class Webrtc extends Model {
  static associate(models) {
    Webrtc.belongsTo(models.Users, { foreignKey: 'host_id', as: 'host' });
  }
}

Webrtc.init({
  id:           { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  room_id:      { type: DataTypes.STRING,  allowNull: false },
  host_id:      { type: DataTypes.INTEGER, allowNull: false },
  participants: { type: DataTypes.JSON,    allowNull: false, defaultValue: [] },
  started_at:   { type: DataTypes.DATE,    allowNull: true  },
  ended_at:     { type: DataTypes.DATE,    allowNull: true  },
}, {
  sequelize,
  modelName:  'Webrtc',
  tableName:  'webrtc_sessions',
  timestamps: false,
  underscored: true,
});

module.exports = Webrtc;