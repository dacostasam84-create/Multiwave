// src/models/UserEvent.model.js
'use strict';

require('')
require('')

class UserEvent extends Model {
  static associate(models) {
    // Chaque événement appartient à un utilisateur
    this.belongsTo(models.Users, {
      foreignKey: 'user_id',
      as: 'user'
    });
  }
}

UserEvent.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },

    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },

    event_type: {
      type: DataTypes.STRING(100),
      allowNull: false
    },

    event_data: {
      type: DataTypes.JSONB, // JSONB recommandé pour PostgreSQL
      allowNull: true
    }
  },
  {
    sequelize,
    modelName: 'UserEvent',
    tableName: 'user_events',

    timestamps: true,
    createdAt: 'created_at',
    updatedAt: false,

    underscored: true
  }
);

module.exports = UserEvent;

