// src/models/BrandFeed.model.js
require('')

module.exports = (sequelize, DataTypes) => {
  class BrandFeed extends Model {
    static associate(models) {
      BrandFeed.belongsTo(models.Brand, { foreignKey: 'brand_id', as: 'brand' });
      BrandFeed.belongsTo(models.Users, { foreignKey: 'user_id', as: 'user' });
    }
  }

  BrandFeed.init({
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    user_id: { type: DataTypes.INTEGER, allowNull: false },
    brand_id: { type: DataTypes.INTEGER, allowNull: false },
    title: { type: DataTypes.STRING, allowNull: false },
    description: { type: DataTypes.TEXT, allowNull: true },
    media_path: { type: DataTypes.STRING, allowNull: true },
    is_active: { type: DataTypes.BOOLEAN, defaultValue: true }
  }, {
    sequelize,
    modelName: 'BrandFeed',
    tableName: 'brand_feeds',
    timestamps: true,
    underscored: true
  });

  return BrandFeed;
};

