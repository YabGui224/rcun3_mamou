
// console.log("Start...");
// throw new Error("An error occurred");
// console.log("end...");


// ======================== Gestion des erreurs avec try...catch...finally ========================

// try {
//     // Bloc d'instructions à tester
//     console.log("Start...");
//     throw new Error("An error occurred");
//     console.log("End...");
    
// } catch (error) {
//     // Gestion des erreurs
//     console.error("Caught an error:", error.message);

// } finally {
//     // Instructions à exécuter dans tous les cas
//     console.log("Finally block...");
    
// }


// ======================== Gestion des erreurs pour les code ASYNCHRONE ========================
const prom = Promise.reject(new Error("Promise rejected error"));

prom
    .then((value) => {
        console.log("Value:", value);
    })
    .catch((error) => {
        console.error("Caught an error in promise:", error);
    })
    .finally(() => {
        console.log("Promise finally block...");
    });