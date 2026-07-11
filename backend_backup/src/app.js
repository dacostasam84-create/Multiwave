/**
 * app.js — Multiwave Backend
 */

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const path = require('path');

// Middlewares d'erreurs
const errorHandler = require('./middlewares/errorHandler.middleware');

// Routes
const callsRoutes = require('./routes/calls.routes');
const likesRoutes = require('./routes/likes.routes');
const postsRoutes = require('./routes/posts.routes');
const usersRoutes = require('./routes/users.routes');
const groupsRoutes = require('./routes/groups.routes');
const ordersRoutes = require('./routes/orders.routes');
const uploadsRoutes = require('./routes/uploads.routes');
const walletsRoutes = require('./routes/wallets.routes');
const commentsRoutes = require('./routes/comments.routes');
const messagesRoutes = require('./routes/messages.routes');
const productsRoutes = require('./routes/products.routes');
const followersRoutes = require('./routes/followers.routes');
const translateRoutes = require('./routes/translate.routes');
const sttRoutes = require('./routes/stt.routes');
const userstateRoutes = require('./routes/userstate.routes');
const usereventRoutes = require('./routes/userevent.routes');
const whatsappRoutes = require('./routes/whatsapp.routes');
const aiRoutes = require('./routes/ai.routes');
const channelsRoutes = require('./routes/channels.routes');

const app = express();

// ===============================
// Middlewares globaux
// ===============================
app.use(cors({ origin: '*', credentials: true }));
app.use(morgan('dev'));
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// ===============================
// Dossier uploads
// ===============================
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// ===============================
// Routes API
// ===============================
app.use('/api/calls', callsRoutes);
app.use('/api/likes', likesRoutes);
app.use('/api/posts', postsRoutes);
app.use('/api/users', usersRoutes);
app.use('/api/groups', groupsRoutes);
app.use('/api/orders', ordersRoutes);
app.use('/api/uploads', uploadsRoutes);
app.use('/api/wallets', walletsRoutes);
app.use('/api/comments', commentsRoutes);
app.use('/api/messages', messagesRoutes);
app.use('/api/products', productsRoutes);
app.use('/api/followers', followersRoutes);
app.use('/api/translate', translateRoutes);
app.use('/api/stt', sttRoutes);
app.use('/api/userstate', userstateRoutes);
app.use('/api/userevent', usereventRoutes);
app.use('/api/whatsapp', whatsappRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/channels', channelsRoutes);

// ===============================
// Route racine & health
// ===============================
app.get('/', (req, res) => res.send('🚀 API Multiwave fonctionne correctement'));
app.get('/health', (req, res) =>
  res.json({ status: 'OK', service: 'Multiwave Backend', timestamp: new Date() })
);

// ===============================
// 404
// ===============================
app.use((req, res) =>
  res.status(404).json({ error: 'Route non trouvée', path: req.originalUrl })
);

// ===============================
// Gestion globale des erreurs
// ===============================
app.use(errorHandler);

module.exports = app;