require("dotenv").config();
const { Sequelize } = require("sequelize");

const sequelize = new Sequelize(
  process.env.MYSQL_DATABASE || "multiwave",
  process.env.MYSQL_USER || "postgres",
  process.env.MYSQL_PASSWORD || "",
  {
    host: process.env.MYSQL_HOST || "127.0.0.1",
    port: process.env.MYSQL_PORT || 5433,
    dialect: "postgres",
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
    console.log("✅ Sequelize PostgreSQL connecté avec succès");
  } catch (error) {
    console.error("❌ Erreur connexion Sequelize:", error.message);
  }
}

connectDB();
module.exports = sequelize;