const WalletsModel = require("../models/Wallets.model");

class WalletsService {
  static async getWalletByUser(userId) {
    const wallet = await db.Wallet.findOne({
      where: { user_id: userId }
    });

    if (!wallet) {
      throw new Error('Portefeuille introuvable');
    }

    return wallet;
  }

  static async getBalance(userId) {
    const wallet = await this.getWalletByUser(userId);
    return wallet.balance;
  }

  static async addFunds(userId, amount) {
    if (amount <= 0) {
      throw new Error('Montant invalide');
    }

    const wallet = await this.getWalletByUser(userId);
    wallet.balance = parseFloat(wallet.balance) + parseFloat(amount);
    wallet.updated_at = new Date();

    await wallet.save();
    return wallet;
  }

  static async withdrawFunds(userId, amount) {
    if (amount <= 0) {
      throw new Error('Montant invalide');
    }

    const wallet = await this.getWalletByUser(userId);

    if (parseFloat(wallet.balance) < parseFloat(amount)) {
      throw new Error('Solde insuffisant');
    }

    wallet.balance = parseFloat(wallet.balance) - parseFloat(amount);
    wallet.updated_at = new Date();

    await wallet.save();
    return wallet;
  }
}

module.exports = WalletsService;

