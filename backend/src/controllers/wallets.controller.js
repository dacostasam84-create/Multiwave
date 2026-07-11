const WalletsService = require("../services/Wallets.service");

const WalletsController = {
  async getBalance(req, res) {
    try {
      const userId = req.params.userId || req.user.id;

      const balance = await WalletsService.getBalance(userId);

      res.json({
        success: true,
        data: {
          userId,
          balance
        }
      });
    } catch (err) {
      console.error('WalletsController.getBalance:', err);
      res.status(500).json({
        success: false,
        message: err.message
      });
    }
  },

  async updateBalance(req, res) {
    try {
      const { userId, amount, type } = req.body;

      if (!userId || typeof amount !== 'number') {
        return res.status(400).json({
          success: false,
          message: 'Champs manquants ou invalides'
        });
      }

      let wallet;
      if (type === 'withdraw') {
        wallet = await WalletsService.withdrawFunds(userId, amount);
      } else {
        wallet = await WalletsService.addFunds(userId, amount);
      }

      res.json({
        success: true,
        message: 'Solde mis à jour',
        data: {
          balance: wallet.balance
        }
      });
    } catch (err) {
      console.error('WalletsController.updateBalance:', err);
      res.status(500).json({
        success: false,
        message: err.message
      });
    }
  }
};

module.exports = WalletsController;

