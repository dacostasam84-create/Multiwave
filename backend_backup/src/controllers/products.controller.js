require('')

module.exports = {
  async createProduct(req, res) {
    try {
      const { seller_id, name, description, price, stock } = req.body;
      if (!seller_id || !name || !price) {
        return res.status(400).json({ error: 'Champs requis manquants' });
      }

      const image = req.file ? req.file.filename : null;
      const product = await ProductsService.createProduct({ sellerId: seller_id, name, description, price, stock, image });

      res.status(201).json({ message: 'Produit créé', product });
    } catch (err) {
      console.error('ProductsController.createProduct:', err);
      res.status(500).json({ error: 'Erreur serveur' });
    }
  },

  async getAllProducts(req, res) {
    try {
      const products = await ProductsService.getAllProducts();
      res.json(products);
    } catch (err) {
      console.error('ProductsController.getAllProducts:', err);
      res.status(500).json({ error: 'Erreur serveur' });
    }
  },

  async getSellerProducts(req, res) {
    try {
      const { sellerId } = req.params;
      const products = await ProductsService.getSellerProducts(sellerId);
      res.json(products);
    } catch (err) {
      console.error('ProductsController.getSellerProducts:', err);
      res.status(500).json({ error: 'Erreur serveur' });
    }
  },

  async getProductById(req, res) {
    try {
      const { productId } = req.params;
      const product = await ProductsService.getProductById(productId);
      if (!product) return res.status(404).json({ error: 'Produit introuvable' });
      res.json(product);
    } catch (err) {
      console.error('ProductsController.getProductById:', err);
      res.status(500).json({ error: 'Erreur serveur' });
    }
  },

  async updateProduct(req, res) {
    try {
      const { productId } = req.params;
      const data = req.body;
      if (req.file) data.image = req.file.filename;

      const product = await ProductsService.updateProduct(productId, data);
      res.json({ message: 'Produit mis à jour', product });
    } catch (err) {
      console.error('ProductsController.updateProduct:', err);
      res.status(500).json({ error: 'Erreur serveur' });
    }
  },

  async deleteProduct(req, res) {
    try {
      const { productId } = req.params;
      await ProductsService.deleteProduct(productId);
      res.json({ message: 'Produit supprimé avec succès' });
    } catch (err) {
      console.error('ProductsController.deleteProduct:', err);
      res.status(500).json({ error: 'Erreur serveur' });
    }
  }
};

