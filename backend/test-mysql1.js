// test-mysql1.js
// ----------------------------------------------------
// Test de connexion MySQL avec Sequelize et nodeuser
// ----------------------------------------------------

require("dotenv").config();
const { Sequelize } = require("sequelize");

// Création de la connexion Sequelize
const sequelize = new Sequelize(
  process.env.MYSQL_DATABASE || "multiwave", // nom de la DB
  process.env.MYSQL_USER || "nodeuser",      // utilisateur créé
  process.env.MYSQL_PASSWORD || "1234",      // mot de passe
  {
    host: process.env.MYSQL_HOST || "127.0.0.1",
    port: process.env.MYSQL_PORT || 3306,
    dialect: "mysql",
    logging: true, // mettre false pour ne pas afficher les requêtes SQL
    timezone: "+00:00",
    define: {
      timestamps: true,
      freezeTableName: true,
    },
    pool: {
      max: 10,
      min: 0,
      acquire: 30000,
      idle: 10000,
    },
  }
);

// Fonction pour tester la connexion
async function testConnection() {
  try {
    await sequelize.authenticate();
    console.log("✅ Connexion MySQL avec nodeuser réussie !");
  } catch (error) {
    console.error("❌ Erreur de connexion :", error.message);
  } finally {
    await sequelize.close();
    console.log("🔒 Connexion fermée");
  }
}

// Lancer le test
testConnection();