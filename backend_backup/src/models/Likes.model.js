// src/models/Likes.model.js
module.exports = (sequelize, DataTypes) => {
  const Like = sequelize.define('Like', {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },
    user_id: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
    },
    post_id: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
    },
  }, {
    tableName: 'likes',
    timestamps: true,
    underscored: true,
    indexes: [
      {
        unique: true,
        fields: ['user_id', 'post_id'],
      },
      { fields: ['post_id'] },
    ],
  });

  // Associations corrigées
  Like.associate = (models) => {
    Like.belongsTo(models.Users, {  // <=== Users avec S
      foreignKey: 'user_id',
      as: 'user',
    });

    Like.belongsTo(models.Post, {
      foreignKey: 'post_id',
      as: 'post',
    });
  };

  return Like;
};

