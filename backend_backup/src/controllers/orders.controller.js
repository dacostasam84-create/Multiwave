require('')

class OrdersController {

  static async createOrder(req, res) {
    try {
      const { productId, quantity, payment_method } = req.body;

      const order = await OrdersService.createOrder({
        userId: req.user.id,
        productId,
        quantity,
        payment_method
      });

      res.status(201).json({
        message: 'Commande créée',
        data: order
      });

    } catch (err) {
      console.error('createOrder:', err.message);
      res.status(400).json({ error: err.message });
    }
  }

  static async getMyOrders(req, res) {
    try {
      const orders = await OrdersService.getUserOrders(req.user.id);
      res.json(orders);
    } catch (err) {
      res.status(500).json({ error: 'Erreur serveur' });
    }
  }

  static async getOrderById(req, res) {
    try {
      const order = await OrdersService.getOrderById(
        req.params.id,
        req.user.id
      );
      res.json(order);
    } catch (err) {
      res.status(404).json({ error: err.message });
    }
  }

  static async updateOrder(req, res) {
    try {
      const order = await OrdersService.updateStatus(
        req.params.id,
        req.body.status
      );

      res.json({
        message: 'Commande mise à jour',
        data: order
      });

    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  }

  static async deleteOrder(req, res) {
    try {
      await OrdersService.deleteOrder(req.params.id, req.user.id);
      res.json({ message: 'Commande supprimée' });
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  }
}

module.exports = OrdersController;

