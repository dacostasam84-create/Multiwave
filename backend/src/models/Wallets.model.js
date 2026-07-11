'use strict';
const { Model, DataTypes } = require("sequelize"); // ✅ Import de Model
const sequelize = require("../config/database");

class Wallet extends Model {
  static associate(models) {
    Wallet.belongsTo(models.Users, {
      foreignKey: 'user_id',
      as: 'user'
    });
  }
}

Wallet.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      unique: true
    },
    balance: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      defaultValue: 0.0
    },
    currency: {
      type: DataTypes.STRING(10),
      allowNull: false,
      defaultValue: 'USD'
    },
    updated_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW
    }
  },
  {
    sequelize,
    modelName: 'Wallet', // ✅ correspond à la classe
    tableName: 'wallets',
    timestamps: false,
    underscored: true
  }
);

module.exports = Wallet; // ✅ exporter la classe
