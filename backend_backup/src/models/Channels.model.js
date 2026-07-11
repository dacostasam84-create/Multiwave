module.exports = (sequelize, DataTypes) => {
  const Channel = sequelize.define('Channel', {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true
    },
    name: {
      type: DataTypes.STRING(120),
      allowNull: false,
      unique: true
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    type: {
      type: DataTypes.ENUM('broadcast', 'ai', 'debate', 'news'),
      defaultValue: 'broadcast'
    },
    owner_id: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false
    },
    is_verified: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    ai_moderation: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    }
  }, {
    tableName: 'channels',
    timestamps: true,
    underscored: true
  });

  Channel.associate = (models) => {
    // Remplacer User par Users pour correspondre au db index.js
    Channel.belongsTo(models.Users, { 
      foreignKey: 'owner_id', 
      as: 'owner', 
      onDelete: 'CASCADE' 
    });

    // Relation Many-to-Many avec les membres
    Channel.belongsToMany(models.Users, {
      through: 'channel_members',
      as: 'members',
      foreignKey: 'channel_id',
      otherKey: 'user_id',
      timestamps: false
    });
  };

  return Channel;
};

