module.exports = (sequelize, DataTypes) => {
  const Follower = sequelize.define('Follower', {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true
    },
    follower_id: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false
    },
    following_id: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false
    }
  }, {
    tableName: 'followers',
    timestamps: true,
    underscored: true,
    indexes: [
      {
        unique: true,
        fields: ['follower_id', 'following_id']
      }
    ]
  });

  Follower.associate = (models) => {
    // ⚠️ Utiliser le nom exact du modèle exporté
    Follower.belongsTo(models.Users, {  // <-- "Users" avec S
      foreignKey: 'follower_id',
      as: 'follower'
    });

    Follower.belongsTo(models.Users, {  // <-- "Users" avec S
      foreignKey: 'following_id',
      as: 'following'
    });
  };

  return Follower;
};

