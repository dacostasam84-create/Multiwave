// src/models/Images.model.js
module.exports = (sequelize, DataTypes) => {
  const Image = sequelize.define('Image', {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },
    user_id: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
    },
    filename: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    path: {
      type: DataTypes.STRING(500),
      allowNull: false,
    },
  }, {
    tableName: 'images',
    timestamps: true,
    underscored: true,
    indexes: [
      { fields: ['user_id'] },
    ],
  });

  // Association correcte avec Users (nom exact du modèle)
  Image.associate = (models) => {
    Image.belongsTo(models.Users, {   // <=== Important : Users avec S
      foreignKey: 'user_id',
      as: 'user',
    });
  };

  return Image;
};

