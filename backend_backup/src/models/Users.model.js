// src/models/Users.model.js
'use strict';
require('')
require('')

class Users extends Model {
  static associate(models) {
    Users.hasMany(models.AiLog, { foreignKey: 'user_id', as: 'ai_logs' });
    Users.hasMany(models.Audio, { foreignKey: 'user_id', as: 'audios' });
    Users.hasMany(models.BrandFeed, { foreignKey: 'user_id', as: 'brand_feeds' });
    Users.hasMany(models.Whisper, { foreignKey: 'senderId', as: 'sent_whispers' });
    Users.hasMany(models.Whisper, { foreignKey: 'receiverId', as: 'received_whispers' });
    Users.hasMany(models.Comment, { foreignKey: 'userId', as: 'comments' });
    Users.hasMany(models.Debate, { foreignKey: 'host_id', as: 'hosted_debates' });
    Users.hasMany(models.UserEvent, { foreignKey: 'user_id', as: 'events' });
    Users.hasMany(models.UserState, { foreignKey: 'user_id', as: 'states' });
  }
}

Users.init(
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    username: { type: DataTypes.STRING, allowNull: false },
    email: { type: DataTypes.STRING, allowNull: false, unique: true },
    password: { type: DataTypes.STRING, allowNull: false },
    role: { type: DataTypes.STRING, defaultValue: 'user' },
    created_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
  },
  {
    sequelize,
    modelName: 'Users',
    tableName: 'users',
    timestamps: false,
    underscored: true,
  }
);

module.exports = Users;

