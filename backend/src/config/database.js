require("dotenv").config();
const { Sequelize } = require("sequelize");

const sequelize = new Sequelize(
  process.env.MYSQL_DB || "multiwave",
  process.env.MYSQL_USER || "root",
  process.env.MYSQL_PASSWORD || "",
  {
    host: process.env.MYSQL_HOST || "localhost",
    port: parseInt(process.env.MYSQL_PORT) || 3306,
    dialect: "mysql",
    logging: false,
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
    }
  }
);

async function connectDB() {
  try {
    await sequelize.authenticate();
    console.log("✅ Sequelize MySQL connecté avec succès");
  } catch (error) {
    console.error("❌ Erreur connexion Sequelize:", error.message);
  }
}

connectDB();
module.exports = sequelize;
