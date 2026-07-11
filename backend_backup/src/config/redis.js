// src/config/redis.js
// Configuration Redis

require('dotenv').config(); // Remplace un require vide pour charger les variables d'environnement
const { createClient } = require('redis'); // Remplace l'autre require vide pour le client Redis

// Création du client Redis
const redisClient = createClient({
  url: process.env.REDIS_URL || 'redis://localhost:6379'
});

// Gestion des erreurs
redisClient.on('error', (err) => console.error('❌ Redis Client Error', err));

(async () => {
  try {
    await redisClient.connect();
    console.log('✅ Redis connecté');
  } catch (err) {
    console.error('❌ Impossible de se connecter à Redis :', err.message);
  }
})();

module.exports = redisClient;