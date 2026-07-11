// src/routes/posts.routes.js
'use strict';

const express = require('express');
const router = express.Router();
const { authMiddleware } = require('../middlewares/auth.middleware');
const { imageUpload } = require('../middlewares/upload.middleware');
const PostsController = require('../controllers/posts.controller');

// Créer un post avec image
router.post('/', authMiddleware, imageUpload.single('image'), PostsController.createPost);

// Récupérer tous les posts
router.get('/', PostsController.getAllPosts);

// Récupérer un post par ID
router.get('/:id', PostsController.getPostById);

// Mettre à jour un post
router.put('/:id', authMiddleware, imageUpload.single('image'), PostsController.updatePost);

// Supprimer un post
router.delete('/:id', authMiddleware, PostsController.deletePost);

module.exports = router;
