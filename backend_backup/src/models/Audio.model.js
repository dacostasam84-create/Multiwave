// src/models/Audio.model.js
require('')

module.exports = (sequelize, DataTypes) => {
  class Audio extends Model {
    static associate(models) {
      Audio.belongsTo(models.Users, { foreignKey: 'user_id', as: 'user' });
    }
  }

  Audio.init({
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    user_id: { type: DataTypes.INTEGER, allowNull: false },
    filename: { type: DataTypes.STRING, allowNull: false },
    path: { type: DataTypes.STRING, allowNull: false },
    duration: { type: DataTypes.INTEGER, allowNull: true }
  }, {
    sequelize,
    modelName: 'Audio',
    tableName: 'audios',
    timestamps: true,
    underscored: true
  });

  return Audio;
};

