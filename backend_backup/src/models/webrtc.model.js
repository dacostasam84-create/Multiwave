// src/models/Webrtc.model.js
require('')

module.exports = (sequelize, DataTypes) => {
  class Webrtc extends Model {}

  Webrtc.init({
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    room_id: { type: DataTypes.STRING, allowNull: false },
    host_id: { type: DataTypes.INTEGER, allowNull: false },
    participants: { type: DataTypes.JSON, allowNull: false, defaultValue: [] },
    started_at: { type: DataTypes.DATE, allowNull: true },
    ended_at: { type: DataTypes.DATE, allowNull: true }
  }, {
    sequelize,
    modelName: 'Webrtc',
    tableName: 'webrtc_sessions',
    timestamps: false,
    underscored: true
  });

  return Webrtc;
};

