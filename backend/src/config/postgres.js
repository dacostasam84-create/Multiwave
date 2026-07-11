// src/config/postgres.js
// Configuration PostgreSQL avec Sequelize

require('dotenv').config();
const { Sequelize } = require('sequelize');

// Vérification des variables d'environnement essentielles
if (!process.env.PG_USER || !process.env.PG_DB) {
  throw new Error('❌ PG_USER et PG_DB doivent être définis dans .env');
}

// Initialisation de Sequelize
const sequelize = new Sequelize(
  process.env.PG_DB,
  process.env.PG_USER,
  process.env.PG_PASSWORD || null,
  {
    host: process.env.PG_HOST || '127.0.0.1',
    port: parseInt(process.env.PG_PORT) || 5433,
    dialect: 'postgres',
    logging: false,
    pool: { max: 10, min: 0, acquire: 30000, idle: 10000 },
    define: { underscored: true, timestamps: true },
  }
);

// Test de connexion
(async () => {
  try {
    await sequelize.authenticate();
    console.log('✅ PostgreSQL connecté via Sequelize');
  } catch (err) {
    console.error('❌ Erreur connexion Sequelize:', err.message);
  }
})();

module.exports = sequelize;