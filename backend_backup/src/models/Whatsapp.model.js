// src/models/Whatsapp.model.js
require('')
require('')

class WhatsAppMessage extends Model {
  static associate(models) {
    // Associer l'expéditeur
    WhatsAppMessage.belongsTo(models.Users, {
      foreignKey: 'sender_id',
      as: 'sender'
    });

    // Associer le destinataire
    WhatsAppMessage.belongsTo(models.Users, {
      foreignKey: 'receiver_id',
      as: 'receiver'
    });
  }
}

WhatsAppMessage.init({
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  sender_id: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  receiver_id: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  content: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  status: {
    type: DataTypes.ENUM('sent', 'delivered', 'seen'),
    defaultValue: 'sent'
  },
  created_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  }
}, {
  sequelize,
  modelName: 'WhatsAppMessage',
  tableName: 'whatsapp_messages',
  timestamps: false,
  underscored: true
});

module.exports = WhatsAppMessage;

