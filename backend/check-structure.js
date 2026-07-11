const fs = require("fs");
const path = require("path");

const base = path.join(__dirname, "src");

function list(dir) {
  return fs.readdirSync(path.join(base, dir))
    .map(f => f.split(".")[0]);
}

const controllers = list("controllers").map(f => f.replace(".controller",""));
const routes = list("routes").map(f => f.replace(".routes",""));
const services = list("services").map(f => f.replace(".service",""));

console.log("Missing Services:");
controllers.forEach(c => {
  if (!services.includes(c)) console.log("  -", c);
});

console.log("\nMissing Routes:");
controllers.forEach(c => {
  if (!routes.includes(c)) console.log("  -", c);
});
