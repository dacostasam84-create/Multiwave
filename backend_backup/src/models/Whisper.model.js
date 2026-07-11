// src/models/Whisper.model.js
require('')

module.exports = (sequelize, DataTypes) => {
  class Whisper extends Model {
    static associate(models) {
      Whisper.belongsTo(models.Users, { foreignKey: 'senderId', as: 'sender' });
      Whisper.belongsTo(models.Users, { foreignKey: 'receiverId', as: 'receiver' });
    }
  }

  Whisper.init({
    id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    senderId: { type: DataTypes.INTEGER, allowNull: false },
    receiverId: { type: DataTypes.INTEGER, allowNull: false },
    message: { type: DataTypes.TEXT, allowNull: false },
    isRead: { type: DataTypes.BOOLEAN, defaultValue: false },
    ephemeral: { type: DataTypes.BOOLEAN, defaultValue: true },
    expiresAt: { type: DataTypes.DATE, allowNull: true }
  }, {
    sequelize,
    modelName: 'Whisper',
    tableName: 'whispers',
    timestamps: true,
    paranoid: true,
    underscored: true
  });

  return Whisper;
};

