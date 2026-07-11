'use strict';
const ProductsService = require('../services/Products.service');

class ProductsController {
  static async createProduct(req, res) {
    try {
      const product = await ProductsService.create({ ...req.body, user_id: req.user.id });
      res.status(201).json({ success: true, data: product });
    } catch (err) {
      res.status(500).json({ success: false, message: err.message });
    }
  }

  static async getAllProducts(req, res) {
    try {
      const { category, search, page = 1, limit = 20 } = req.query;
      const products = await ProductsService.getAll({ category, search, page, limit });
      res.json({ success: true, data: products });
    } catch (err) {
      res.status(500).json({ success: false, message: err.message });
    }
  }

  static async getSellerProducts(req, res) {
    try {
      const products = await ProductsService.getBySeller(req.params.sellerId || req.user.id);
      res.json({ success: true, data: products });
    } catch (err) {
      res.status(500).json({ success: false, message: err.message });
    }
  }

  static async getProductById(req, res) {
    try {
      const product = await ProductsService.getById(req.params.id);
      if (!product) return res.status(404).json({ success: false, message: 'Produit introuvable' });
      res.json({ success: true, data: product });
    } catch (err) {
      res.status(500).json({ success: false, message: err.message });
    }
  }

  static async updateProduct(req, res) {
    try {
      const product = await ProductsService.update(req.params.id, req.user.id, req.body);
      res.json({ success: true, data: product });
    } catch (err) {
      res.status(500).json({ success: false, message: err.message });
    }
  }

  static async deleteProduct(req, res) {
    try {
      await ProductsService.delete(req.params.id, req.user.id);
      res.json({ success: true, message: 'Produit supprimé' });
    } catch (err) {
      res.status(500).json({ success: false, message: err.message });
    }
  }

  static async getFeatured(req, res) {
    try {
      const products = await ProductsService.getFeatured();
      res.json({ success: true, data: products });
    } catch (err) {
      res.status(500).json({ success: false, message: err.message });
    }
  }
}

module.exports = ProductsController;