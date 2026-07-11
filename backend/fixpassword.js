require('dotenv').config();
const bcrypt = require('bcryptjs');
const { Sequelize } = require('sequelize');

const hash = bcrypt.hashSync('Multiwave2026!', 10);
console.log('Hash:', hash);

const seq = new Sequelize('multiwave', 'postgres', '', {
  host: '127.0.0.1',
  port: 5433,
  dialect: 'postgres',
  logging: false,
});

seq.query(`UPDATE users SET password='${hash}' WHERE email='zahnouni@multiwave.com'`)
  .then(() => { console.log('✅ Mot de passe mis à jour !'); process.exit(0); })
  .catch(e => { console.error('❌', e.message); process.exit(1); });