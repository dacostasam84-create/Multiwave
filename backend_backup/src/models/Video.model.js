// src/models/Video.model.js
require('')
require('')

class Video extends Model {
  static associate(models) {
    // Associer correctement avec le modèle Users
    Video.belongsTo(models.Users, {
      foreignKey: 'user_id',
      as: 'user'
    });
  }
}

Video.init({
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  filename: {
    type: DataTypes.STRING(255),
    allowNull: false
  },
  path: {
    type: DataTypes.STRING(255),
    allowNull: false
  },
  duration: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  created_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  }
}, {
  sequelize,
  modelName: 'Video',
  tableName: 'videos',
  timestamps: false,
  underscored: true
});

module.exports = Video;

