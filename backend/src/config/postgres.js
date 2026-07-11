require('dotenv').config();
const { Sequelize } = require('sequelize');

const sequelize = new Sequelize(
  process.env.PG_DB || 'multiwave',
  process.env.PG_USER || 'postgres',
  process.env.PG_PASSWORD || '',
  {
    host: process.env.PG_HOST || '127.0.0.1',
    port: parseInt(process.env.PG_PORT) || 5432,
    dialect: 'postgres',
    logging: false,
    pool: { max: 10, min: 0, acquire: 30000, idle: 10000 },
    define: { underscored: true, timestamps: true },
  }
);

(async () => {
  try {
    await sequelize.authenticate();
    console.log('✅ PostgreSQL connecté via Sequelize');
  } catch (err) {
    console.error('❌ PostgreSQL non connecté:', err.message);
  }
})();

module.exports = sequelize;
