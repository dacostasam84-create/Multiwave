// src/models/index.js
// Auteur : Zahnouni Issam

const fs = require("fs");
const path = require("path");
const { Sequelize, DataTypes, Model } = require("sequelize");
const sequelize = require("../config/database");

const db = {};

// ─────────────────────────────────────────────
// Charger tous les fichiers modèles
// Supporte : .model.js ET .js (sauf index.js)
// ─────────────────────────────────────────────
fs.readdirSync(__dirname)
  .filter(file =>
    file !== "index.js" &&
    file.endsWith(".js") &&
    !file.endsWith(".test.js")
  )
  .forEach(file => {
    try {
      const modelDef = require(path.join(__dirname, file));
      let model;

      if (typeof modelDef === "function") {
        // Ancienne syntaxe : module.exports = (sequelize, DataTypes) => { ... }
        if (!(modelDef.prototype instanceof Model)) {
          model = modelDef(sequelize, DataTypes);
        } else {
          // Classe Sequelize déjà initialisée
          model = modelDef;
        }
      } else if (modelDef && modelDef.prototype instanceof Model) {
        // Classe exportée directement
        model = modelDef;
      }

      if (model && model.name) {
        db[model.name] = model;
        console.log(`✅ Modèle chargé : ${model.name}`);
      } else {
        console.warn(`⚠️ ${file} ignoré (pas un modèle Sequelize valide)`);
      }
    } catch (err) {
      console.error(`❌ Erreur chargement modèle ${file}:`, err.message);
    }
  });

// ─────────────────────────────────────────────
// Créer les associations
// ─────────────────────────────────────────────
Object.values(db).forEach(model => {
  if (typeof model.associate === "function") {
    model.associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;