module.exports = (sequelize, DataTypes) => {
  const CallParticipant = sequelize.define('CallParticipant', {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true
    },
    call_id: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false
    },
    user_id: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false
    },
    role: {
      type: DataTypes.STRING(50),
      allowNull: false,
      defaultValue: 'guest'
    },
    joined_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW
    },
    left_at: {
      type: DataTypes.DATE,
      allowNull: true
    }
  }, {
    tableName: 'call_participants',
    timestamps: false,
    underscored: true
  });

  CallParticipant.associate = (models) => {
    CallParticipant.belongsTo(models.Call, { foreignKey: 'call_id', as: 'call' });
    CallParticipant.belongsTo(models.Users, { foreignKey: 'user_id', as: 'user' });
  };

  return CallParticipant;
};

