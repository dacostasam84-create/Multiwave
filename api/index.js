// Entrée serverless Vercel : on exporte l'application Express.
// Ne jamais require backend/server.js ici : ce fichier démarre un serveur HTTP
// et appelle process.exit(), ce qui provoque FUNCTION_INVOCATION_FAILED.
module.exports = require('../backend/src/app');
