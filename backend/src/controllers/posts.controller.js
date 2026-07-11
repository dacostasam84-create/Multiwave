// src/controllers/posts.controller.js
'use strict';

const PostsService = require('../services/Posts.service');

module.exports = {

  // Créer un post
  async createPost(req, res) {
    try {
      const { content, status } = req.body;

      let media = null;
      let mediaType = 'none';

      if (req.file) {
        media = req.file.filename;
        if (req.file.mimetype.startsWith('image')) mediaType = 'image';
        else if (req.file.mimetype.startsWith('video')) mediaType = 'video';
        else if (req.file.mimetype.startsWith('audio')) mediaType = 'audio';
      }

      const post = await PostsService.createPost({
        userId: req.user.id,
        content,
        media,
        mediaType,
        status
      });

      res.status(201).json(post);

    } catch (err) {
      console.error('createPost:', err.message);
      res.status(400).json({ error: err.message });
    }
  },

  // Récupérer tous les posts
  async getAllPosts(req, res) {
    try {
      const posts = await PostsService.getAllPosts();
      res.json(posts);
    } catch (err) {
      res.status(500).json({ error: 'Erreur serveur' });
    }
  },

  // Récupérer un post par ID
  async getPostById(req, res) {
    try {
      const post = await PostsService.getPostById(req.params.id);
      if (!post) return res.status(404).json({ error: 'Post non trouvé' });
      res.json(post);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  // Mettre à jour un post
  async updatePost(req, res) {
    try {
      const { content, status } = req.body;

      let media = null;
      let mediaType = 'none';

      if (req.file) {
        media = req.file.filename;
        if (req.file.mimetype.startsWith('image')) mediaType = 'image';
        else if (req.file.mimetype.startsWith('video')) mediaType = 'video';
        else if (req.file.mimetype.startsWith('audio')) mediaType = 'audio';
      }

      const updatedPost = await PostsService.updatePost(req.params.id, req.user.id, {
        content, status, media, mediaType
      });

      res.json(updatedPost);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  },

  // Supprimer un post
  async deletePost(req, res) {
    try {
      await PostsService.deletePost(req.params.id, req.user.id);
      res.json({ message: 'Post supprimé' });
    } catch (err) {
      res.status(403).json({ error: err.message });
    }
  }

};
