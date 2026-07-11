require('dotenv').config();
const http = require('http');
const app = require('./src/app');
const { Server } = require('socket.io');
const socketConfig = require('./src/config/socket');
const sequelize = require('./src/config/database');
const redisClient = require('./src/config/redis');
const syncDatabase = require('./src/config/sync');
const logger = console;
const server = http.createServer(app);
const io = new Server(server, socketConfig);
io.on('connection', (socket) => {
  logger.log('Socket connecte: ' + socket.id);
  try { const aiSocket = require('./src/sockets/ai.socket'); if (aiSocket) aiSocket(io, socket); logger.log('AI Socket branche pour ' + socket.id); } catch (err) { logger.error('Erreur AI socket:', err.message); }
  try { const whatsappSocket = require('./src/sockets/whatsapp.socket'); if (whatsappSocket) whatsappSocket(io, socket); logger.log('WhatsApp Socket branche pour ' + socket.id); } catch (err) { logger.error('Erreur WhatsApp socket:', err.message); }
  try { const webrtcSocket = require('./src/sockets/Webrtc.socket'); if (webrtcSocket) webrtcSocket(io, socket); logger.log('WebRTC Socket branche pour ' + socket.id); } catch (err) { logger.error('Erreur WebRTC socket:', err.message); }
  try { const notificationsSocket = require('./src/sockets/notifications.socket'); if (notificationsSocket) notificationsSocket(io, socket); logger.log('Notifications Socket branche pour ' + socket.id); } catch (err) { logger.error('Erreur Notifications socket:', err.message); }
  socket.on('disconnect', () => { logger.log('Socket deconnecte: ' + socket.id); });
});
app.get('/test-db', async (req, res) => { try { await sequelize.authenticate(); let redisStatus = 'Non connecte'; try { redisStatus = await redisClient.ping(); } catch { redisStatus = 'Redis non connecte'; } res.json({ database: 'Sequelize connecte', redis: redisStatus }); } catch (err) { res.status(500).json({ error: err.message }); } });
const PORT = process.env.PORT || 3000;
(async () => { try { await syncDatabase(); logger.log('Base de donnees synchronisee !'); server.listen(PORT, () => { logger.log('Serveur actif sur le port ' + PORT); }); } catch (err) { logger.error('Echec du demarrage serveur:', err); process.exit(1); } })();
