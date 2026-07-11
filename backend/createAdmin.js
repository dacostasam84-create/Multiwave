require('dotenv').config();
const db = require('./src/models');
db.sequelize.sync().then(async () => {
  try {
    await db.sequelize.query("INSERT INTO users (username, email, password, full_name, role, is_verified, is_active, created_at, updated_at) VALUES ('zahnouni_issam', 'zahnouni@multiwave.com', '$2a$10$CnByHBv9NRWRrGs/ekn6BOMJGS3GlmDTMOLEZOsQ14tfAg1wpkPi.', 'Zahnouni Issam', 'admin', 1, 1, NOW(), NOW())");
    console.log('OK');
  } catch(e) { console.log(e.message); }
  process.exit(0);
}).catch(e => { console.error(e.message); process.exit(1); });