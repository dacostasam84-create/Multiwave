// src/models/UserState.model.js
require('')
require('')

class UserState extends Model {
  static associate(models) {
    // Association correcte avec Users (modèle classe)
    UserState.belongsTo(models.Users, { foreignKey: 'user_id', as: 'user' });
  }
}

UserState.init({
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  state: {
    type: DataTypes.STRING(50),
    allowNull: false
  },
  last_active: {
    type: DataTypes.DATE,
    allowNull: true
  }
}, {
  sequelize,
  modelName: 'UserState',
  tableName: 'user_states',
  timestamps: true,
  underscored: true
});

module.exports = UserState;

