// src/models/Upload.model.js
require('')

module.exports = (sequelize) => {
  class Upload extends Model {
    static associate(models) {
      // Relation avec le modèle Users (exact nom du modèle : Users)
      this.belongsTo(models.Users, { 
        foreignKey: 'user_id', 
        as: 'user' 
      });
    }
  }

  Upload.init(
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
      filename: {
        type: DataTypes.STRING(255),
        allowNull: false
      },
      file_type: {
        type: DataTypes.STRING(50),
        allowNull: false
      },
      path: {
        type: DataTypes.STRING(255),
        allowNull: false
      },
      size: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false
      },
      mimetype: {
        type: DataTypes.STRING(100),
        allowNull: false
      },
      created_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
      }
    },
    {
      sequelize,
      modelName: 'Upload',
      tableName: 'uploads',
      timestamps: false,
      underscored: true
    }
  );

  return Upload;
};

