module.exports = (sequelize, DataTypes) => {
  const Ad = sequelize.define('Ad', {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    title: { type: DataTypes.STRING(255), allowNull: false, validate: { notEmpty: true, len: [3, 255] } },
    description: { type: DataTypes.TEXT, allowNull: true },
    image_url: { type: DataTypes.STRING(500), allowNull: true, validate: { isUrl: true } },
    link: { type: DataTypes.STRING(500), allowNull: true, validate: { isUrl: true } },
    brand_id: { type: DataTypes.INTEGER, allowNull: false, references: { model: 'brands', key: 'id' }, onDelete: 'CASCADE' },
    start_date: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW },
    end_date: { type: DataTypes.DATE, allowNull: true, validate: { isAfterStart(value) { if(value && value < this.start_date) throw new Error('La date de fin doit être après la date de début'); } } },
    is_active: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: true }
  }, {
    tableName: 'ads',
    timestamps: true,
    underscored: true
  });

  Ad.associate = db => {
    Ad.belongsTo(db.Brand, { foreignKey: 'brand_id', as: 'brand' });
  };

  return Ad;
};

