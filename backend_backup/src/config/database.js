// ----------------------------------------------------
//               CONFIG DATABASE MYSQL
// ----------------------------------------------------
require('')
require('')

const mysqlDB = mysql.createPool({
  host: process.env.MYSQL_HOST || 'localhost',
  user: process.env.MYSQL_USER || 'root',
  password: process.env.MYSQL_PASSWORD || '',
  database: process.env.MYSQL_DATABASE || 'multiwave',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  port: process.env.MYSQL_PORT || 3306,
  timezone: '+00:00'
});

mysqlDB.getConnection()
  .then(conn => {
    console.log('✅ MySQL connecté');
    conn.release();
  })
  .catch(err => {
    console.error('❌ Erreur connexion MySQL:', err);
  });

module.exports = mysqlDB;

