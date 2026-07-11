// src/models/Users.model.js
// Auteur : Zahnouni Issam
'use strict';

const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/database');

class Users extends Model {
  static associate(models) {
    if (models.Posts)         Users.hasMany(models.Posts,         { foreignKey: 'user_id',    as: 'posts'          });
    if (models.Videos)        Users.hasMany(models.Videos,        { foreignKey: 'user_id',    as: 'videos'         });
    if (models.Messages)      Users.hasMany(models.Messages,      { foreignKey: 'sender_id',  as: 'sent_messages'  });
    if (models.Comment)       Users.hasMany(models.Comment,       { foreignKey: 'user_id',    as: 'comments'       });
    if (models.Likes)         Users.hasMany(models.Likes,         { foreignKey: 'user_id',    as: 'likes'          });
    if (models.Followers)     Users.hasMany(models.Followers,     { foreignKey: 'follower_id',as: 'following'      });
    if (models.Followers)     Users.hasMany(models.Followers,     { foreignKey: 'followed_id',as: 'followers'      });
    if (models.STT)           Users.hasMany(models.STT,           { foreignKey: 'user_id',    as: 'transcriptions' });
    if (models.Calls)         Users.hasMany(models.Calls,         { foreignKey: 'caller_id',  as: 'calls'          });
    if (models.Notifications) Users.hasMany(models.Notifications, { foreignKey: 'user_id',    as: 'notifications'  });
    if (models.Wallets)       Users.hasOne(models.Wallets,        { foreignKey: 'user_id',    as: 'wallet'         });
    if (models.Orders)        Users.hasMany(models.Orders,        { foreignKey: 'user_id',    as: 'orders'         });
    if (models.Products)      Users.hasMany(models.Products,      { foreignKey: 'user_id',    as: 'products'       });
  }
}

Users.init({
  id:                 { type: DataTypes.INTEGER,      autoIncrement: true, primaryKey: true },
  username:           { type: DataTypes.STRING(50),   allowNull: false, unique: true },
  email:              { type: DataTypes.STRING(100),  allowNull: false, unique: true },
  password:           { type: DataTypes.STRING(255),  allowNull: false },
  full_name:          { type: DataTypes.STRING(100),  allowNull: true  },
  avatar:             { type: DataTypes.STRING(255),  allowNull: true  },
  bio:                { type: DataTypes.TEXT,          allowNull: true  },
  phone:              { type: DataTypes.STRING(20),   allowNull: true  },
  website:            { type: DataTypes.STRING(255),  allowNull: true  },
  location:           { type: DataTypes.STRING(100),  allowNull: true  },
  birth_date:         { type: DataTypes.DATEONLY,     allowNull: true  },
  role:               { type: DataTypes.ENUM('user','admin','moderator'), defaultValue: 'user' },
  preferred_language: { type: DataTypes.STRING(10),   defaultValue: 'fr' },
  is_verified:        { type: DataTypes.BOOLEAN,      defaultValue: false },
  is_online:          { type: DataTypes.BOOLEAN,      defaultValue: false },
  last_seen:          { type: DataTypes.DATE,          allowNull: true  },
  followers_count:    { type: DataTypes.INTEGER,      defaultValue: 0  },
  following_count:    { type: DataTypes.INTEGER,      defaultValue: 0  },
  posts_count:        { type: DataTypes.INTEGER,      defaultValue: 0  },
}, {
  sequelize,
  modelName: 'Users',
  tableName: 'users',
  timestamps: true,
  underscored: true,
});

module.exports = Users;