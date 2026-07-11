module.exports = (sequelize, DataTypes) => {
  const Call = sequelize.define('Call', {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true
    },
    room_id: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    host_id: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false
    },
    started_at: {
      type: DataTypes.DATE,
      allowNull: true
    },
    ended_at: {
      type: DataTypes.DATE,
      allowNull: true
    }
  }, {
    tableName: 'calls',
    timestamps: false,
    underscored: true
  });

  Call.associate = (models) => {
    Call.hasMany(models.CallParticipant, { foreignKey: 'call_id', as: 'participants' });
  };

  return Call;
};

