'use strict';
const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/database');
class Likes extends Model {
  static associate(models) {
    Likes.belongsTo(models.Users, { foreignKey: 'user_id', as: 'user' });
    Likes.belongsTo(models.Posts, { foreignKey: 'post_id', as: 'post' });
    Likes.belongsTo(models.Videos, { foreignKey: 'video_id', as: 'video' });
    Likes.belongsTo(models.Debates, { foreignKey: 'debate_id', as: 'debate' });
  }
}
Likes.init({
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  user_id: { type: DataTypes.INTEGER, allowNull: false },
  post_id: { type: DataTypes.INTEGER, allowNull: true },
  video_id: { type: DataTypes.INTEGER, allowNull: true },
  debate_id: { type: DataTypes.INTEGER, allowNull: true },
  reaction: { type: DataTypes.ENUM('like','love','haha','wow','sad','angry','fire','clap','flower','kiss','heart','star'), defaultValue: 'like' },
}, {
  sequelize,
  modelName: 'Likes',
  tableName: 'likes',
  timestamps: true,
  underscored: true,
});
module.exports = Likes;
