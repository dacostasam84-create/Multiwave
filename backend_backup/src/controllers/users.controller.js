// src/controllers/Users.controller.js
require('')

const UsersController = {
  async register(req, res) {
    try {
      const user = await UsersService.register(req.body);
      res.status(201).json({ success: true, userId: user.id, message: 'Utilisateur créé' });
    } catch (err) {
      res.status(400).json({ success: false, message: err.message });
    }
  },

  async login(req, res) {
    try {
      const result = await UsersService.login(req.body);
      res.json({ success: true, ...result });
    } catch (err) {
      res.status(401).json({ success: false, message: err.message });
    }
  },

  async getAll(req, res) {
    try {
      const users = await UsersService.getAll();
      res.json({ success: true, data: users });
    } catch (err) {
      res.status(500).json({ success: false, message: err.message });
    }
  },

  async getById(req, res) {
    try {
      const user = await UsersService.getById(req.params.id);
      if (!user) return res.status(404).json({ success: false, message: 'Utilisateur introuvable' });
      res.json({ success: true, data: user });
    } catch (err) {
      res.status(500).json({ success: false, message: err.message });
    }
  },

  async update(req, res) {
    try {
      const user = await UsersService.update(req.params.id, req.body);
      res.json({ success: true, data: user });
    } catch (err) {
      res.status(400).json({ success: false, message: err.message });
    }
  },

  async delete(req, res) {
    try {
      await UsersService.delete(req.params.id);
      res.json({ success: true, message: 'Utilisateur supprimé' });
    } catch (err) {
      res.status(400).json({ success: false, message: err.message });
    }
  }
};

module.exports = UsersController;

