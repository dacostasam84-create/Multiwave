// src/services/Users.service.js
const bcrypt = require('bcrypt'); // ou 'bcryptjs' si compilation bcrypt pose problème
const jwt = require('jsonwebtoken');

const UsersModel = require("../models/Users.model");        
const UserStateModel = require("../models/UserState.model"); 
const WalletsModel = require("../models/Wallets.model");      

const UsersService = {
  async register(data) {
    const { username, email, password } = data;

    const existing = await UsersModel.findOne({ where: { email } });
    if (existing) throw new Error('Email déjà utilisé');

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await UsersModel.create({ username, email, password: hashedPassword });
    return user;
  },

  async login(data) {
    const { email, password } = data;
    const user = await UsersModel.findOne({ where: { email } });
    if (!user) throw new Error('Utilisateur introuvable');

    const match = await bcrypt.compare(password, user.password);
    if (!match) throw new Error('Mot de passe incorrect');

    const token = jwt.sign(
      { id: user.id },
      process.env.JWT_SECRET || 'secret',
      { expiresIn: '7d' }
    );

    return { token, userId: user.id };
  },

  async getAll() {
    return UsersModel.findAll({ attributes: { exclude: ['password'] } });
  },

  async getById(id) {
    return UsersModel.findByPk(id, { attributes: { exclude: ['password'] } });
  },

  async update(id, data) {
    const user = await UsersModel.findByPk(id);
    if (!user) throw new Error('Utilisateur introuvable');

    if (data.password) {
      data.password = await bcrypt.hash(data.password, 10);
    }

    await user.update(data);
    return user;
  },

  async delete(id) {
    const user = await UsersModel.findByPk(id);
    if (!user) throw new Error('Utilisateur introuvable');

    await user.destroy();
    return true;
  }
};

module.exports = UsersService;
