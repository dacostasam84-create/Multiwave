module.exports = (sequelize, DataTypes) => {
  const Message = sequelize.define('Message', {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true
    },
    sender_id: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false
    },
    receiver_id: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false
    },
    content: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    status: {
      type: DataTypes.ENUM('sent', 'delivered', 'seen'),
      defaultValue: 'sent'
    }
  }, {
    tableName: 'messages',
    timestamps: true,
    underscored: true,
    paranoid: true,
    indexes: [
      { fields: ['sender_id'] },
      { fields: ['receiver_id'] }
    ]
  });

  Message.associate = (models) => {
    // ⚠️ Ici utiliser le nom exact du modèle : 'Users'
    Message.belongsTo(models.Users, {
      foreignKey: 'sender_id',
      as: 'sender'
    });

    Message.belongsTo(models.Users, {
      foreignKey: 'receiver_id',
      as: 'receiver'
    });
  };

  return Message;
};

