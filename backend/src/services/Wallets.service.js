'use strict';

// ⚠ Import correct du modèle Wallet
const Wallet = require('../models/wallets.model'); // <-- nom exact du fichier

class WalletsService {
  // Récupérer le portefeuille par user
  static async getWalletByUser(userId) {
    const wallet = await Wallet.findOne({
      where: { user_id: userId } // correspond à ta colonne user_id
    });

    if (!wallet) {
      throw new Error('Portefeuille introuvable');
    }

    return wallet;
  }

  // Récupérer le solde
  static async getBalance(userId) {
    const wallet = await this.getWalletByUser(userId);
    return wallet.balance;
  }

  // Ajouter des fonds
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

  // Retirer des fonds
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
