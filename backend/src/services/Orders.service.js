const OrdersModel = require("../models/Orders.model");
class OrdersService {

  static async createOrder({ userId, productId, quantity, payment_method }) {
    if (!productId || !payment_method) {
      throw new Error('Champs manquants');
    }

    const product = await db.Product.findByPk(productId);
    if (!product) throw new Error('Produit introuvable');

    const qty = quantity && quantity > 0 ? quantity : 1;
    const unitPrice = product.price;
    const totalPrice = unitPrice * qty;

    return await db.Order.create({
      user_id: userId,
      product_id: productId,
      quantity: qty,
      unit_price: unitPrice,
      total_price: totalPrice,
      payment_method,
      status: 'pending'
    });
  }

  static async getUserOrders(userId) {
    return await db.Order.findAll({
      where: { user_id: userId },
      include: [
        {
          model: db.Product,
          as: 'product',
          attributes: ['id', 'name', 'price']
        }
      ],
      order: [['created_at', 'DESC']]
    });
  }

  static async getOrderById(orderId, userId) {
    const order = await db.Order.findByPk(orderId, {
      include: [
        { model: db.Product, as: 'product' }
      ]
    });

    if (!order || order.user_id !== userId) {
      throw new Error('Commande introuvable');
    }

    return order;
  }

  static async updateStatus(orderId, status) {
    const allowed = ['pending', 'processing', 'completed', 'cancelled'];
    if (!allowed.includes(status)) {
      throw new Error('Status invalide');
    }

    const order = await db.Order.findByPk(orderId);
    if (!order) throw new Error('Commande introuvable');

    order.status = status;
    await order.save();

    return order;
  }

  static async deleteOrder(orderId, userId) {
    const order = await db.Order.findByPk(orderId);
    if (!order || order.user_id !== userId) {
      throw new Error('Commande introuvable');
    }

    await order.destroy();
    return true;
  }
}

module.exports = OrdersService;




