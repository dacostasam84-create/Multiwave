// src/config/sync.js
// Auteur : Zahnouni Issam
'use strict';

require('dotenv').config();
const sequelize = require('./database');

// ===============================
// Sync DB uniquement
// Les associations sont gérées dans models/index.js
// ===============================
async function syncDatabase() {
  try {
    await sequelize.authenticate();
    console.log('✅ Sequelize MySQL connecté avec succès');
    await sequelize.sync({ alter: false });
    console.log('✅ Base de données synchronisée');
  } catch (err) {
    console.error('❌ Erreur connexion Sequelize:', err.message);
    throw err;
  }
}

module.exports = syncDatabase;