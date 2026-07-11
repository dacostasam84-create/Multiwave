// src/models/AiLog.model.js
require('')

module.exports = (sequelize, DataTypes) => {
  class AiLog extends Model {
    static associate(models) {
      AiLog.belongsTo(models.Users, { foreignKey: 'user_id', as: 'user' });
    }
  }

  AiLog.init({
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    user_id: { type: DataTypes.INTEGER, allowNull: true },
    action: { type: DataTypes.STRING(100), allowNull: false },
    model: { type: DataTypes.STRING(100), allowNull: true },
    input_text: { type: DataTypes.TEXT, allowNull: true },
    output_text: { type: DataTypes.TEXT, allowNull: true },
    tokens_used: { type: DataTypes.INTEGER, allowNull: true },
    status: { type: DataTypes.ENUM('success','blocked','flagged','error'), defaultValue: 'success' }
  }, {
    sequelize,
    modelName: 'AiLog',
    tableName: 'ai_logs',
    timestamps: true,
    underscored: true
  });

  return AiLog;
};

