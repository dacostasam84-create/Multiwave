// src/models/Comments.model.js
'use strict';
require('')
require('')

class Comment extends Model {
  static associate(models) {
    if (models.Users) {
      this.belongsTo(models.Users, { foreignKey: 'userId', as: 'user' });
    }
    if (models.Post) {
      this.belongsTo(models.Post, { foreignKey: 'postId', as: 'post' });
    }
  }
}

Comment.init(
  {
    id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    userId: { type: DataTypes.INTEGER, allowNull: false },
    postId: { type: DataTypes.INTEGER, allowNull: false },
    content: { type: DataTypes.TEXT, allowNull: false, validate: { notEmpty: true } },
    isDeleted: { type: DataTypes.BOOLEAN, defaultValue: false },
  },
  {
    sequelize,
    modelName: 'Comment',
    tableName: 'comments',
    timestamps: true,
    paranoid: true,
    underscored: true,
    indexes: [{ fields: ['userId'] }, { fields: ['postId'] }],
  }
);

module.exports = Comment;

