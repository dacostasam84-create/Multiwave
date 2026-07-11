// src/config/sync.js
require('')
require('')

const isDev = process.env.NODE_ENV !== 'production';

async function syncDatabase() {
  try {
    await db.sequelize.authenticate();
    console.log(chalk.green('✅ Connexion à la base de données réussie !'));

    const models = Object.keys(db).filter((key) => db[key].sequelize);
    console.log(chalk.blue(`🔄 Synchronisation des tables (${isDev ? 'dev' : 'prod'})...`));

    for (const modelName of models) {
      try {
        await db[modelName].sync({
          force: false, // ne supprime jamais les tables existantes
          alter: true,  // ajuste les colonnes si nécessaire
        });

        const columns = Object.keys(db[modelName].rawAttributes);
        console.log(chalk.green(`✅ Table '${modelName}' synchronisée`));
        console.log(chalk.gray(`   Colonnes: ${columns.join(', ')}`));
      } catch (err) {
        console.warn(chalk.yellow(`⚠️ Problème table '${modelName}': ${err.message}`));
      }
    }

    console.log(chalk.blue('🎉 Toutes les tables ont été synchronisées.'));
  } catch (error) {
    console.error(chalk.red('❌ Erreur connexion ou synchronisation :'), error);
    throw error;
  }
}

module.exports = syncDatabase;

