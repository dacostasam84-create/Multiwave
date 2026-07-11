module.exports = (sequelize, DataTypes) => {
  const MessageStatus = sequelize.define('MessageStatus', {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true
    },
    message_id: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false
    },
    user_id: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false
    },
    status: {
      type: DataTypes.ENUM('sent', 'delivered', 'seen'),
      allowNull: false,
      defaultValue: 'sent'
    }
  }, {
    tableName: 'message_statuses',
    timestamps: true,
    underscored: true,
    indexes: [
      {
        unique: true,
        fields: ['message_id', 'user_id']
      },
      { fields: ['status'] }
    ]
  });

  MessageStatus.associate = (models) => {
    // ⚠️ Correction des noms de modèles
    MessageStatus.belongsTo(models.Message, {
      foreignKey: 'message_id',
      as: 'message'
    });

    MessageStatus.belongsTo(models.Users, {  // <-- Users avec "s"
      foreignKey: 'user_id',
      as: 'user'
    });
  };

  return MessageStatus;
};

