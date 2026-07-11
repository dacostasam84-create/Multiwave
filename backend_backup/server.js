/**
 * server.js — Multiwave Backend
 */

require('dotenv').config();
const http = require('http');
const app = require('./src/app');
const { Server } = require('socket.io');
const socketConfig = require('./src/config/socket');

// Bases de données
const mysqlDB = require('./src/config/database');      // MySQL
const postgresDB = require('./src/config/postgres');   // PostgreSQL
const redisClient = require('./src/config/redis');     // Redis
const syncDatabase = require('./src/config/sync');     // Fonction de sync DB

const logger = console;

// ===============================
// Serveur HTTP + Socket.IO
// ===============================
const server = http.createServer(app);
const io = new Server(server, socketConfig);

// ===============================
// Socket.IO
// ===============================
io.on('connection', (socket) => {
  logger.log(`🔵 Socket connecté: ${socket.id}`);

  try {
    require('./src/sockets/ai.socket')(io, socket);
    logger.log(`✅ AI Socket branché pour ${socket.id}`);
  } catch (err) {
    logger.error('❌ Erreur branchement AI socket:', err.message);
  }

  try {
    require('./src/sockets/whatsapp.socket')(io, socket);
    logger.log(`✅ WhatsApp Socket branché pour ${socket.id}`);
  } catch (err) {
    logger.error('❌ Erreur branchement WhatsApp socket:', err.message);
  }

  socket.on('disconnect', () => {
    logger.log(`🔴 Socket déconnecté: ${socket.id}`);
  });
});

// ===============================
// Route test DB
// ===============================
app.get('/test-db', async (req, res) => {
  try {
    const [mysqlRows] = await mysqlDB.query("SELECT NOW() AS now");
    const [pgRows] = await postgresDB.query("SELECT NOW()");
    let redisTime = 'Non connecté';

    try {
      redisTime = await redisClient.ping();
    } catch {
      redisTime = 'Redis non connecté';
    }

    res.json({
      mysqlTime: mysqlRows[0].now,
      postgresTime: pgRows[0].now,
      redis: redisTime
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ===============================
// Lancement serveur
// ===============================
const PORT = process.env.PORT || 3000;

(async () => {
  try {
    await syncDatabase();
    logger.log('🎉 Base de données synchronisée !');

    server.listen(PORT, () => {
      logger.log(`🚀 Serveur actif sur le port ${PORT}`);
    });
  } catch (err) {
    logger.error('❌ Échec du démarrage serveur:', err);
    process.exit(1);
  }
})();