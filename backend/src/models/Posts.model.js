// src/models/Posts.model.js
// Auteur : Zahnouni Issam
'use strict';

const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/database');

class Posts extends Model {
  static associate(models) {
    if (models.Users)    Posts.belongsTo(models.Users,   { foreignKey: 'user_id',  as: 'author'   });
    if (models.Brand)    Posts.belongsTo(models.Brand,   { foreignKey: 'brand_id', as: 'brand'    });
    if (models.Comment)  Posts.hasMany(models.Comment,   { foreignKey: 'post_id',  as: 'comments' });
    if (models.Comments) Posts.hasMany(models.Comments,  { foreignKey: 'post_id',  as: 'comments_list' });
    if (models.Likes)    Posts.hasMany(models.Likes,     { foreignKey: 'post_id',  as: 'likes'    });
  }
}

Posts.init({
  id:             { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  user_id:        { type: DataTypes.INTEGER, allowNull: false },
  brand_id:       { type: DataTypes.INTEGER, allowNull: true  },
  content:        { type: DataTypes.TEXT,    allowNull: false },
  media_url:      { type: DataTypes.STRING(255), allowNull: true },
  media_type:     { type: DataTypes.ENUM('image','video','audio','none'), defaultValue: 'none' },
  language:       { type: DataTypes.STRING(10), defaultValue: 'fr' },
  status:         { type: DataTypes.ENUM('public','private','friends'), defaultValue: 'public' },
  views_count:    { type: DataTypes.INTEGER, defaultValue: 0 },
  likes_count:    { type: DataTypes.INTEGER, defaultValue: 0 },
  comments_count: { type: DataTypes.INTEGER, defaultValue: 0 },
}, {
  sequelize,
  modelName: 'Posts',
  tableName: 'posts',
  timestamps: true,
  underscored: true,
});

module.exports = Posts;