// src/controllers/comments.controller.js
'use strict';

const CommentsService = require("../services/Comments.service");

class CommentsController {
  /**
   * Créer un commentaire
   * POST /comments
   */
  static async createComment(req, res) {
    try {
      const { post_id, content } = req.body;

      if (!post_id || !content) {
        return res.status(400).json({
          success: false,
          message: "Champs manquants : post_id ou content"
        });
      }

      const comment = await CommentsService.createComment({
        userId: req.user.id,
        postId: post_id,
        content
      });

      return res.status(201).json({
        success: true,
        message: "Commentaire créé avec succès",
        data: comment
      });
    } catch (err) {
      console.error("createComment:", err.message);
      return res.status(500).json({
        success: false,
        message: err.message
      });
    }
  }

  /**
   * Récupérer tous les commentaires d’un post
   * GET /comments/post/:postId
   */
  static async getCommentsByPost(req, res) {
    try {
      const { postId } = req.params;
      if (!postId) {
        return res.status(400).json({
          success: false,
          message: "postId est requis"
        });
      }

      const comments = await CommentsService.getCommentsByPost(postId);

      return res.status(200).json({
        success: true,
        data: comments
      });
    } catch (err) {
      console.error("getCommentsByPost:", err.message);
      return res.status(500).json({
        success: false,
        message: err.message
      });
    }
  }

  /**
   * Supprimer un commentaire
   * DELETE /comments/:id
   */
  static async deleteComment(req, res) {
    try {
      const { id } = req.params;
      if (!id) {
        return res.status(400).json({
          success: false,
          message: "id du commentaire requis"
        });
      }

      await CommentsService.deleteComment(id, req.user.id);

      return res.status(200).json({
        success: true,
        message: "Commentaire supprimé avec succès"
      });
    } catch (err) {
      console.error("deleteComment:", err.message);
      return res.status(err.status || 500).json({
        success: false,
        message: err.message
      });
    }
  }
}

module.exports = CommentsController;
