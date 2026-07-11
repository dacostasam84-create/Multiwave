'use strict';
const authMiddleware = require('./auth.middleware');
const uploadMiddleware = require('./upload.middleware');
const errorHandler = require('./errorHandler.middleware.js');
module.exports = { authMiddleware, uploadMiddleware, errorHandler };
