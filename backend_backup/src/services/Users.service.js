// src/services/Users.service.js
require('')
require('')
require('')

const UsersService = {
  async register(data) {
    const { username, email, password } = data;

    // Vérifier si email existe déjà
    const existing = await Users.findOne({ where: { email } });
    if (existing) throw new Error('Email déjà utilisé');

    // Hash du mot de passe
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await Users.create({ username, email, password: hashedPassword });
    return user;
  },

  async login(data) {
    const { email, password } = data;
    const user = await Users.findOne({ where: { email } });
    if (!user) throw new Error('Utilisateur introuvable');

    const match = await bcrypt.compare(password, user.password);
    if (!match) throw new Error('Mot de passe incorrect');

    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET || 'secret', { expiresIn: '7d' });
    return { token, userId: user.id };
  },

  async getAll() {
    return Users.findAll({ attributes: { exclude: ['password'] } });
  },

  async getById(id) {
    return Users.findByPk(id, { attributes: { exclude: ['password'] } });
  },

  async update(id, data) {
    const user = await Users.findByPk(id);
    if (!user) throw new Error('Utilisateur introuvable');

    if (data.password) {
      data.password = await bcrypt.hash(data.password, 10);
    }

    await user.update(data);
    return user;
  },

  async delete(id) {
    const user = await Users.findByPk(id);
    if (!user) throw new Error('Utilisateur introuvable');

    await user.destroy();
    return true;
  }
};

module.exports = UsersService;

