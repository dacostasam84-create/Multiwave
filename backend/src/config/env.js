// src/config/env.js
// Gestion des variables d'environnement
// Charge automatiquement les variables depuis un fichier .env si présent

require('dotenv').config(); // Remplace le require vide

// Tu peux aussi ajouter des exports si tu veux centraliser les variables
module.exports = {
  NODE_ENV: process.env.NODE_ENV || 'development',
  PORT: parseInt(process.env.PORT) || 3000,
  DATABASE_URL: process.env.DATABASE_URL || '',
  REDIS_URL: process.env.REDIS_URL || '',
  OPENAI_API_KEY: process.env.OPENAI_API_KEY || ''
};
