// src/models/Debate.model.js
// Auteur : Zahnouni Issam
'use strict';

const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/database');

class Debates extends Model {
  static associate(models) {
    if (models.Users)    Debates.belongsTo(models.Users,   { foreignKey: 'host_id',    as: 'host'     });
    if (models.Comment)  Debates.hasMany(models.Comment,   { foreignKey: 'debate_id',  as: 'comments' });
    if (models.Comments) Debates.hasMany(models.Comments,  { foreignKey: 'debate_id',  as: 'comments_list' });
    if (models.Likes)    Debates.hasMany(models.Likes,     { foreignKey: 'debate_id',  as: 'likes'    });
  }
}

Debates.init({
  id:                 { type: DataTypes.INTEGER,     autoIncrement: true, primaryKey: true },
  host_id:            { type: DataTypes.INTEGER,     allowNull: false },
  title:              { type: DataTypes.STRING(255), allowNull: false },
  description:        { type: DataTypes.TEXT,         allowNull: true  },
  thumbnail:          { type: DataTypes.STRING(255), allowNull: true  },
  status:             { type: DataTypes.ENUM('scheduled','live','ended'), defaultValue: 'scheduled' },
  language:           { type: DataTypes.STRING(10),  defaultValue: 'fr' },
  max_participants:   { type: DataTypes.INTEGER,     defaultValue: 10   },
  participants_count: { type: DataTypes.INTEGER,     defaultValue: 0    },
  views_count:        { type: DataTypes.INTEGER,     defaultValue: 0    },
  max_duration:       { type: DataTypes.INTEGER,     defaultValue: 5400 },
  scheduled_at:       { type: DataTypes.DATE,         allowNull: true   },
  started_at:         { type: DataTypes.DATE,         allowNull: true   },
  ended_at:           { type: DataTypes.DATE,         allowNull: true   },
  recording_url:      { type: DataTypes.STRING(255), allowNull: true   },
}, {
  sequelize,
  modelName: 'Debates',
  tableName: 'debates',
  timestamps: true,
  underscored: true,
});

module.exports = Debates;