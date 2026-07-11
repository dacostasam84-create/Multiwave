require('')
require('')
require('')

class ProductsService {
  static async createProduct({ sellerId, name, description, price, stock = 0, image = null }) {
    return await db.Product.create({
      seller_id: sellerId,
      name,
      description,
      price,
      stock,
      image
    });
  }

  static async getAllProducts(limit = 50) {
    return await db.Product.findAll({
      limit,
      order: [['created_at', 'DESC']],
      include: [{ model: db.User, as: 'seller', attributes: ['id', 'username'] }]
    });
  }

  static async getSellerProducts(sellerId) {
    return await db.Product.findAll({
      where: { seller_id: sellerId },
      order: [['created_at', 'DESC']]
    });
  }

  static async getProductById(productId) {
    return await db.Product.findByPk(productId, {
      include: [{ model: db.User, as: 'seller', attributes: ['id', 'username'] }]
    });
  }

  static async updateProduct(productId, data) {
    const product = await db.Product.findByPk(productId);
    if (!product) throw new Error('Produit introuvable');
    await product.update(data);
    return product;
  }

  static async deleteProduct(productId) {
    const product = await db.Product.findByPk(productId);
    if (!product) throw new Error('Produit introuvable');

    if (product.image) {
      const filePath = path.join(__dirname, '../../uploads', product.image);
      if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
    }

    await product.destroy();
    return true;
  }
}

module.exports = ProductsService;

