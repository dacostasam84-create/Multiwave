'use strict';
const { Op } = require('sequelize');
const Products = require('../models/Products.model');
const Users = require('../models/Users.model');

class ProductsService {
  static async create(data) {
    return await Products.create(data);
  }

  static async getAll({ category, search, page = 1, limit = 20 } = {}) {
    const where = { status: 'active' };
    if (category) where.category = category;
    if (search) where.name = { [Op.like]: `%${search}%` };

    return await Products.findAll({
      where,
      include: [{ model: Users, as: 'seller', attributes: ['id', 'username', 'avatar'] }],
      order: [['created_at', 'DESC']],
      limit: parseInt(limit),
      offset: (parseInt(page) - 1) * parseInt(limit)
    });
  }

  static async getBySeller(userId) {
    return await Products.findAll({
      where: { user_id: userId },
      order: [['created_at', 'DESC']]
    });
  }

  static async getById(id) {
    return await Products.findByPk(id, {
      include: [{ model: Users, as: 'seller', attributes: ['id', 'username', 'avatar'] }]
    });
  }

  static async update(id, userId, data) {
    const product = await Products.findOne({ where: { id, user_id: userId } });
    if (!product) throw new Error('Produit introuvable ou non autorisé');
    await product.update(data);
    return product;
  }

  static async delete(id, userId) {
    const product = await Products.findOne({ where: { id, user_id: userId } });
    if (!product) throw new Error('Produit introuvable ou non autorisé');
    await product.destroy();
    return true;
  }

  static async getFeatured() {
    return await Products.findAll({
      where: { is_featured: true, status: 'active' },
      include: [{ model: Users, as: 'seller', attributes: ['id', 'username', 'avatar'] }],
      limit: 10,
      order: [['created_at', 'DESC']]
    });
  }
}

module.exports = ProductsService;