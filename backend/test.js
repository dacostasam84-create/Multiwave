// test.js
const pool = require('./src/config/database');

async function testConnection() {
  try {
    const [rows] = await pool.query('SELECT NOW() AS now');
    console.log('Connexion OK ! Heure du serveur :', rows[0].now);
  } catch (err) {
    console.error('Erreur de connexion :', err);
  }
}

testConnection();
