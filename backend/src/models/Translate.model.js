// src/models/Translate.model.js
// Auteur : Zahnouni Issam
'use strict';

const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/database');

class Translation extends Model {
  static associate(models) {
    if (models.Users) Translation.belongsTo(models.Users, { foreignKey: 'user_id', as: 'user' });
  }
}

Translation.init({
  id:              { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  user_id:         { type: DataTypes.INTEGER, allowNull: false },
  source_text:     { type: DataTypes.TEXT,    allowNull: false },
  translated_text: { type: DataTypes.TEXT,    allowNull: false },
  source_lang:     { type: DataTypes.STRING(10), allowNull: false },
  target_lang:     { type: DataTypes.STRING(10), allowNull: false },
  audio_path:      { type: DataTypes.STRING(255), allowNull: true },
}, {
  sequelize,
  modelName: 'Translation',
  tableName: 'translations',
  timestamps: true,
  underscored: true,
  paranoid: true,
});

module.exports = Translation;