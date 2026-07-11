const bcrypt = require('bcryptjs');

async function test() {
  const password = "123456";

  // Créer le hash
  const hashed = await bcrypt.hash(password, 10);
  console.log("Hash :", hashed);

  // Vérifier le mot de passe
  const match = await bcrypt.compare(password, hashed);
  console.log("Mot de passe valide ?", match);
}

test();
