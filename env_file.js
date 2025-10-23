

console.log("\n--- Chargement des variables d'environnement depuis le process ---\n");
const {NODE_ENV, DB_URL} = process.env;
console.log({NODE_ENV, DB_URL});
