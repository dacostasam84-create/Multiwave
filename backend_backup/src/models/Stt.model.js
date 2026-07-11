module.exports = (sequelize, DataTypes) => {
  const STT = sequelize.define('STT', {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true
    },
    user_id: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false
    },
    text: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    language: {
      type: DataTypes.STRING(20),
      allowNull: true
    },
    audio_path: {
      type: DataTypes.STRING(255),
      allowNull: true
    }
  }, {
    tableName: 'stt',
    timestamps: true,
    underscored: true
  });

  STT.associate = (models) => {
    // ⚠️ Attention au nom exact du modèle utilisateur
    STT.belongsTo(models.Users, { foreignKey: 'user_id', as: 'user' });
  };

  return STT;
};

