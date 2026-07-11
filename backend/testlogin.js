require('dotenv').config();
const bcrypt = require('bcrypt');
const { Sequelize } = require('sequelize');

const seq = new Sequelize('multiwave', 'postgres', '', {
  host: '127.0.0.1', port: 5433, dialect: 'postgres', logging: false,
});

seq.query("SELECT password FROM users WHERE email='zahnouni@multiwave.com'", { type: 'SELECT' })
  .then(async (rows) => {
    const hash = rows[0].password;
    console.log('Hash:', hash);
    const match = await bcrypt.compare('Multiwave2026!', hash);
    console.log('Match:', match);
    process.exit(0);
  })
  .catch(e => { console.error(e.message); process.exit(1); });