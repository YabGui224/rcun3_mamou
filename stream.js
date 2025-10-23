const {readFile, createReadStream, createWriteStream} = require("fs");
const { pipeline } = require("stream");

const xsFile = "./files/small.txt";
const mdFile = "./files/mdFile.txt";

// readFile(mdFile, "utf-8", (err, data) => {
//     if (err) {
//         console.error("Error reading file:", err);
//     } else {
//         console.log("Success");
//     }
// })

//  ========================== Buffer manipulation ==============================
// const buffer = Buffer.from("Hello, World!", "utf-8");

// console.log(buffer);
// console.log(buffer.byteLength);
// console.log(buffer.toLocaleString());
// console.log(buffer.toJSON());


const rs = createReadStream("./files/mdFile.txt", /*{encoding: "utf-8", highWaterMark: 10}*/);
const ws = createWriteStream("./files/mdFile_copy_2.txt");

// // A la reception des donnees
// rs.on("data", (chunk) => {
//     const result = ws.write(chunk);
//     if(!result) {
//         console.log("Backpressure!!!\n");
//         rs.pause();
//     }
// });

// // Erreur lors de la lecture 
// rs.on("error", (err) => {
//     log("Error reading file:", err);
// });

// // La fin de la lecture
// rs.on("end", () => {
//     ws.end();
//     console.log("Finished reading file.");
// });

// // erreur lors de l'ecriture
// ws.on("error", (err) => {
//     log("Error writing file:", err);
// });

// // Le drain indique que le buffer est vide
// ws.on("drain", () => {
//     console.log("Drain event - resuming reading\n");
//     rs.resume();
// });

// ws.on("finish", () => {
//     console.log("Write stream finished.");
// });


// =================================== Pipe ======================================

// rs.on("error", (err) => {
//     console.log("Error reading file");
// });

// ws.on("error", (err) => {
//     console.log("Error writing file");
// });

// // // Utilisation de la methode pipe
// rs.pipe(ws);

// ws.on("finish", () => {
//     console.log("File copied successfully using pipe.");
// });

// ================================ Pipeline ====================================

pipeline(rs, ws, (err) => {
    if (err) {
        console.log("Error ...");
    } else {
        console.log("Finish !!!");
    }
});