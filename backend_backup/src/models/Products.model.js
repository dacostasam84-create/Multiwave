module.exports = (sequelize, DataTypes) => {
  const Product = sequelize.define('Product', {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true
    },

    name: {
      type: DataTypes.STRING(150),
      allowNull: false
    },

    description: {
      type: DataTypes.TEXT,
      allowNull: true
    },

    price: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false
    },

    stock: {
      type: DataTypes.INTEGER.UNSIGNED,
      defaultValue: 0
    },

    status: {
      type: DataTypes.ENUM('active', 'inactive', 'archived'),
      defaultValue: 'active'
    }

  }, {
    tableName: 'products',
    timestamps: true,
    underscored: true,
    indexes: [
      { fields: ['name'] },
      { fields: ['status'] }
    ]
  });

  Product.associate = (models) => {
    // Un produit appartient à un utilisateur (vendeur)
    Product.belongsTo(models.Users, {
      foreignKey: 'user_id',
      as: 'seller'
    });

    // Un produit peut avoir plusieurs commandes
    Product.hasMany(models.Order, {
      foreignKey: 'product_id',
      as: 'orders'
    });
  };

  return Product;
};

