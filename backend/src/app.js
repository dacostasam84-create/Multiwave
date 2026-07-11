/**
 * app.js — Multiwave Backend
 * Auteur : Zahnouni Issam
 */

require('dotenv').config();
const express = require('express');
const cors    = require('cors');
const morgan  = require('morgan');
const path    = require('path');

// ===============================
// Routes existantes
// ===============================
const callsRoutes     = require('./routes/Calls.routes');
const likesRoutes     = require('./routes/Likes.routes');
const postsRoutes     = require('./routes/Posts.routes');
const usersRoutes     = require('./routes/users.routes');
const groupsRoutes    = require('./routes/Groups.routes');
const ordersRoutes    = require('./routes/Orders.routes');
const uploadRoutes    = require('./routes/Upload.routes');
const walletsRoutes   = require('./routes/Wallets.routes');
const commentsRoutes  = require('./routes/Comments.routes');
const messagesRoutes  = require('./routes/messages.routes');
const productsRoutes  = require('./routes/products.routes');
const followersRoutes = require('./routes/Followers.routes');
const translateRoutes = require('./routes/translate.routes');
const sttRoutes       = require('./routes/stt.routes');
const userstateRoutes = require('./routes/userstate.routes');
const usereventRoutes = require('./routes/userevent.routes');
const whatsappRoutes  = require('./routes/whatsapp.routes');
const aiRoutes        = require('./routes/ai.routes');
const channelsRoutes  = require('./routes/Channels.routes');
const webrtcRoutes    = require('./routes/Webrtc.routes');
const debateRoutes    = require('./routes/Debate.routes');
const videoRoutes     = require('./routes/Video.routes')
const imagesRoutes    = require('./routes/Images.routes');
const adsRoutes       = require('./routes/Ads.routes');
const whisperRoutes   = require('./routes/Whisper.routes');
const audioRoutes     = require('./routes/Audio.routes');
const searchRoutes = require('./routes/search.routes');
const rateLimit = require('./middlewares/rateLimit.middleware');
// ===============================
// Nouvelles routes
// ===============================
const feedRoutes = require('./routes/feed.routes');
const notificationsRoutes = require('./routes/Notifications.routes');
const brandsRoutes        = require('./routes/Brand.routes');
const brandFeedsRoutes    = require('./routes/BrandFeed.routes');
const analyticsRoutes     = require('./routes/Analytics.routes');
const jobsRoutes          = require('./routes/Jobs.routes');
const walletRoutes = require('./routes/wallets.routes');
const datingRoutes        = require('./routes/Dating.routes');

// ===============================
// Error Middleware
// ===============================
const errorHandler = require('./middlewares/errorHandler.middleware');

const app = express();

// ===============================
// Global Middlewares
// ===============================
app.use(cors({ origin: process.env.FRONTEND_URL || 'http://localhost:3001', credentials: true }));
app.use(morgan('dev'));
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));
app.use('/api/search', searchRoutes);
// Login — 5 tentatives / 15 min
app.use('/api/users/login',    rateLimit({ windowMs: 15*60*1000, max: 5 }));

// Register — 3 comptes / heure
app.use('/api/users/register', rateLimit({ windowMs: 60*60*1000, max: 3 }));

// Search — 30 / minute
app.use('/api/search',         rateLimit({ windowMs: 60*1000, max: 30 }));

// Upload — 20 / heure
app.use('/api/uploads',        rateLimit({ windowMs: 60*60*1000, max: 20 }));
// ===============================
// Static Uploads Folder
// ===============================
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// ===============================
// API Routes — Existantes
// ===============================
app.use('/api/calls',      callsRoutes);
app.use('/api/likes',      likesRoutes);
app.use('/api/posts',      postsRoutes);
app.use('/api/users',      usersRoutes);
app.use('/api/groups',     groupsRoutes);
app.use('/api/orders',     ordersRoutes);
app.use('/api/uploads',    uploadRoutes);
app.use('/api/wallets',    walletsRoutes);
app.use('/api/comments',   commentsRoutes);
app.use('/api/messages',   messagesRoutes);
app.use('/api/products',   productsRoutes);
app.use('/api/followers',  followersRoutes);
app.use('/api/translate',  translateRoutes);
app.use('/api/stt',        sttRoutes);
app.use('/api/userstate',  userstateRoutes);
app.use('/api/userevent',  usereventRoutes);
app.use('/api/whatsapp',   whatsappRoutes);
app.use('/api/ai',         aiRoutes);
app.use('/api/channels',   channelsRoutes);
app.use('/api/feed', feedRoutes);
app.use('/api/webrtc',     webrtcRoutes);
app.use('/api/debates',    debateRoutes);
app.use('/api/videos',     videoRoutes);
app.use('/api/images',     imagesRoutes);
app.use('/api/ads',        adsRoutes);
app.use('/api/whisper',    whisperRoutes);
app.use('/api/audio',      audioRoutes);

// ===============================
// API Routes — Nouvelles
// ===============================
app.use('/api/notifications', notificationsRoutes);
app.use('/api/brands',        brandsRoutes);
app.use('/api/brand-feeds',   brandFeedsRoutes);
app.use('/api/analytics',     analyticsRoutes);
app.use('/api/jobs',          jobsRoutes);
app.use('/api/wallet',        walletRoutes);
app.use('/api/dating',        datingRoutes);

// ===============================
// Root & Health Check
// ===============================
app.get('/', (req, res) =>
  res.send('🚀 API Multiwave fonctionne correctement')
);

app.get('/health', (req, res) =>
  res.json({
    status:    'OK',
    service:   'Multiwave Backend',
    version:   '2.0',
    timestamp: new Date(),
  })
);

// ===============================
// 404 Handler
// ===============================
app.use((req, res) =>
  res.status(404).json({
    error: 'Route non trouvée',
    path:  req.originalUrl,
  })
);

// ===============================
// Global Error Handler
// ===============================
app.use(errorHandler);

module.exports = app;