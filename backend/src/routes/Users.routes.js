// src/routes/Users.routes.js
// Auteur : Zahnouni Issam
'use strict';

const express    = require('express');
const router     = express.Router();
const UsersController  = require('../controllers/users.controller');
const { authMiddleware } = require('../middlewares/auth.middleware');
const validate   = require('../middlewares/validate.middleware');

// Routes utilisateurs
router.post('/register', validate(validate.schemas.register), UsersController.register);
router.post('/login',    validate(validate.schemas.login),    UsersController.login);
router.get('/',          authMiddleware, UsersController.getAll);
router.get('/:id',       authMiddleware, UsersController.getById);
router.put('/:id',       authMiddleware, UsersController.update);
router.delete('/:id',    authMiddleware, UsersController.delete);

module.exports = router;