// src/models/Debate.model.js
'use strict';
require('')
require('')

class Debate extends Model {
  static associate(models) {
    if (models.Users) {
      this.belongsTo(models.Users, { foreignKey: 'host_id', as: 'host' });
    }
  }
}

Debate.init(
  {
    id: { type: DataTypes.STRING(36), primaryKey: true },
    title: { type: DataTypes.STRING(255), allowNull: false },
    host_id: { type: DataTypes.INTEGER, allowNull: false },
    description: { type: DataTypes.TEXT, allowNull: true },
    status: { type: DataTypes.ENUM('scheduled', 'live', 'ended'), defaultValue: 'scheduled' },
    max_duration: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 90 * 60 },
    scheduled_at: { type: DataTypes.DATE, allowNull: true },
  },
  {
    sequelize,
    modelName: 'Debate',
    tableName: 'debates',
    timestamps: true,
    underscored: true,
  }
);

module.exports = Debate;

