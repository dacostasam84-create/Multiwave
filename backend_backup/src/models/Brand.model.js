// src/models/Brand.model.js
require('')

module.exports = (sequelize, DataTypes) => {
  class Brand extends Model {
    static associate(models) {
      Brand.hasMany(models.BrandFeed, { foreignKey: 'brand_id', as: 'feeds' });
    }
  }

  Brand.init({
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    name: { type: DataTypes.STRING, allowNull: false },
    description: { type: DataTypes.TEXT, allowNull: true },
    created_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW }
  }, {
    sequelize,
    modelName: 'Brand',
    tableName: 'brands',
    timestamps: false,
    underscored: true
  });

  return Brand;
};

