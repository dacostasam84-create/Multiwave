'use strict';

const { DataTypes, Model } = require('sequelize');
const sequelize = require('../config/database');

class WhatsAppMessage extends Model {
  static associate(models) {
    this.belongsTo(models.Users, { foreignKey: 'sender_id', as: 'sender' });
    this.belongsTo(models.Users, { foreignKey: 'receiver_id', as: 'receiver' });
  }
}

WhatsAppMessage.init(
  {
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
      allowNull: true
    },
    content: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    media_path: {
      type: DataTypes.STRING,
      allowNull: true
    },
    status: {
      type: DataTypes.ENUM('sent', 'delivered', 'seen'),
      defaultValue: 'sent'
    },
    created_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW
    }
  },
  {
    sequelize,
    modelName: 'WhatsAppMessage',
    tableName: 'whatsapp_messages',
    timestamps: false,
    underscored: true
  }
);

module.exports = WhatsAppMessage;