module.exports = (sequelize, DataTypes) => {
  const Post = sequelize.define('Post', {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true
    },
    user_id: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false
    },
    brand_id: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: true
    },
    content: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    media: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    media_type: {
      type: DataTypes.ENUM('image', 'video', 'audio', 'none'),
      defaultValue: 'none'
    },
    status: {
      type: DataTypes.ENUM('public', 'private', 'friends'),
      defaultValue: 'public'
    }
  }, {
    tableName: 'posts',
    timestamps: true,
    underscored: true,
    indexes: [
      { fields: ['user_id'] },
      { fields: ['status'] }
    ]
  });

  Post.associate = (models) => {
    // ⚠️ Correction ici : models.Users et pas models.User
    Post.belongsTo(models.Users, {
      foreignKey: 'user_id',
      as: 'author'
    });

    Post.belongsTo(models.Brand, {
      foreignKey: 'brand_id',
      as: 'brand'
    });

    Post.hasMany(models.Like, {
      foreignKey: 'post_id',
      as: 'likes'
    });

    Post.hasMany(models.Comment, {
      foreignKey: 'post_id',
      as: 'comments'
    });
  };

  return Post;
};

