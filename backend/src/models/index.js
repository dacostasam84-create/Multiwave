// src/models/index.js
// Auteur : Zahnouni Issam

const fs        = require("fs");
const path      = require("path");
const Sequelize = require("sequelize");
const { DataTypes, Model } = Sequelize;
const sequelize = require("../config/database");

// Injecter Model globalement pour les anciens modèles
global.Model = Model;

const db = {};

// Charger tous les modèles
fs.readdirSync(__dirname)
  .filter(file =>
    file !== "index.js" &&
    file.endsWith(".js") &&
    !file.endsWith(".test.js")
  )
  .forEach(file => {
    try {
      delete require.cache[require.resolve(path.join(__dirname, file))];
      const modelDef = require(path.join(__dirname, file));
      let model;

      if (typeof modelDef === "function") {
        if (modelDef.prototype instanceof Model) {
          model = modelDef;
        } else {
          try { model = modelDef(sequelize, DataTypes); } catch {
            try { model = modelDef(sequelize); } catch {}
          }
        }
      } else if (modelDef && modelDef.prototype instanceof Model) {
        model = modelDef;
      }

      if (model && model.name && model.name !== 'Model') {
        db[model.name] = model;
        console.log(`✅ ${model.name}`);
      } else {
        console.warn(`⚠️  ${file} ignoré`);
      }
    } catch (err) {
      console.error(`❌ ${file} : ${err.message}`);
    }
  });

// Associations apres chargement complet
Object.values(db).forEach(model => {
  if (typeof model.associate === "function") {
    try {
      model.associate(db);
    } catch (err) {
      console.error(`❌ Association ${model.name} : ${err.message}`);
    }
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;