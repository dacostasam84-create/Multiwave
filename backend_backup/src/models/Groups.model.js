module.exports = (sequelize, DataTypes) => {
  const Group = sequelize.define('Group', {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    name: { type: DataTypes.STRING(120), allowNull: false },
    slug: { type: DataTypes.STRING(150), allowNull: false, unique: true },
    description: DataTypes.TEXT,
    owner_id: { type: DataTypes.INTEGER, allowNull: false },
    visibility: { type: DataTypes.ENUM('public','private','restricted'), defaultValue: 'public' },
    ai_moderation: { type: DataTypes.BOOLEAN, defaultValue: true },
    is_verified: { type: DataTypes.BOOLEAN, defaultValue: false },
    status: { type: DataTypes.ENUM('active','archived','suspended'), defaultValue: 'active' }
  }, {
    tableName: 'groups',
    timestamps: true,
    underscored: true,
    indexes: [
      { fields: ['slug'] },
      { fields: ['owner_id'] },
      { fields: ['visibility'] }
    ]
  });

  Group.associate = (models) => {
    Group.belongsTo(models.Users, { foreignKey: 'owner_id', as: 'owner' });
  };

  return Group;
};

