// src/models/Videos.model.js
// Auteur : Zahnouni Issam
'use strict';

const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/database');

class Videos extends Model {
  static associate(models) {
    if (models.Users)    Videos.belongsTo(models.Users,   { foreignKey: 'user_id',  as: 'author'   });
    if (models.Comment)  Videos.hasMany(models.Comment,   { foreignKey: 'video_id', as: 'comments' });
    if (models.Comments) Videos.hasMany(models.Comments,  { foreignKey: 'video_id', as: 'comments_list' });
    if (models.Likes)    Videos.hasMany(models.Likes,     { foreignKey: 'video_id', as: 'likes'    });
  }
}

Videos.init({
  id:             { type: DataTypes.INTEGER,      autoIncrement: true, primaryKey: true },
  user_id:        { type: DataTypes.INTEGER,      allowNull: false },
  title:          { type: DataTypes.STRING(255),  allowNull: false },
  description:    { type: DataTypes.TEXT,          allowNull: true  },
  filename:       { type: DataTypes.STRING(255),  allowNull: false },
  path:           { type: DataTypes.STRING(255),  allowNull: false },
  thumbnail:      { type: DataTypes.STRING(255),  allowNull: true  },
  duration:       { type: DataTypes.INTEGER,      allowNull: true  },
  size:           { type: DataTypes.BIGINT,        allowNull: true  },
  language:       { type: DataTypes.STRING(10),   defaultValue: 'fr' },
  status:         { type: DataTypes.ENUM('public','private','friends'), defaultValue: 'public' },
  views_count:    { type: DataTypes.INTEGER,      defaultValue: 0  },
  likes_count:    { type: DataTypes.INTEGER,      defaultValue: 0  },
  comments_count: { type: DataTypes.INTEGER,      defaultValue: 0  },
  is_debate:      { type: DataTypes.BOOLEAN,      defaultValue: false },
}, {
  sequelize,
  modelName: 'Videos',
  tableName: 'videos',
  timestamps: true,
  underscored: true,
});

module.exports = Videos;