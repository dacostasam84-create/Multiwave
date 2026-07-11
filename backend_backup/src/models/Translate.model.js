// src/models/Translation.model.js
require('')

module.exports = (sequelize) => {
  class Translation extends Model {
    static associate(models) {
      // Relation avec le modèle Users (exact nom du modèle : Users)
      this.belongsTo(models.Users, { 
        foreignKey: 'user_id', 
        as: 'user' 
      });
    }
  }

  Translation.init(
    {
      id: {
        type: DataTypes.INTEGER.UNSIGNED,
        autoIncrement: true,
        primaryKey: true
      },
      user_id: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false
      },
      source_text: {
        type: DataTypes.TEXT,
        allowNull: false
      },
      translated_text: {
        type: DataTypes.TEXT,
        allowNull: false
      },
      source_lang: {
        type: DataTypes.STRING(10),
        allowNull: false
      },
      target_lang: {
        type: DataTypes.STRING(10),
        allowNull: false
      },
      audio_path: {
        type: DataTypes.STRING(255),
        allowNull: true
      }
    },
    {
      sequelize,
      modelName: 'Translation',
      tableName: 'translations',
      timestamps: true,
      underscored: true,
      paranoid: true // facultatif : active le "soft delete"
    }
  );

  return Translation;
};

