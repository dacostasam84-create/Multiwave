const Sequelize = require("sequelize");
const sequelize = require("../config/database");
const Users = require("./Users.model");
const Posts = require("./Posts.model");
const db = {};

// Charger tous les fichiers .model.js sauf index.js
fs.readdirSync(__dirname)
  .filter(file => file.endsWith('.model.js') && file !== 'index.js')
  .forEach(file => {
    const modelDef = require(path.join(__dirname, file));

    let model;

    if (typeof modelDef === 'function') {
      // Si le modèle est en fonction (ancienne syntaxe)
      if (!(modelDef.prototype instanceof Model)) {
        model = modelDef(sequelize, DataTypes);
      } else {
        // Si le modèle est déjà une classe Model initialisée
        model = modelDef;
      }
    }

    if (model) db[model.name] = model;
    else console.warn(`⚠️  ${file} ne semble pas être un modèle Sequelize valide.`);
  });

// Créer les associations
Object.values(db).forEach(model => {
  if (typeof model.associate === 'function') {
    model.associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;

