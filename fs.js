const fs = require("node:fs"); // commonjs
// const path = require("node:path");
 const FILENAME = "new_file_2.txt";

// Creer un nouveau fichier en mode ecriture M1
// fs.open(FILENAME, "w", (err, fd) => {
//     if (err) {
//         return console.log(err.message);
//     }
//     console.log("file.txt opened...");

//     // Fermer le fichier apres tout traitement
//     fs.close(fd, (err) => {
//         if (err) {
//             return console.log(err.message);
//         }   
//     });
//     console.log("Closed ...");
// })

// Creer un nouveau fichier en mode ecriture M2, a la base la methode permet d'ecrire dans un fichier mais si le fichier n'existe pas alors il sera cree par la
// la methode writeFile()
// const fileContent = "Hello from Node.js fs module";
// fs.writeFile(FILENAME, fileContent, (err) => {
//     if (err) {
//         return console.log(err.message);
//     }
//     console.log(`${FILENAME} created with content...`);
// });

//  Ajouter du contenu a la suite du fichier qui contient deja de la data
// const newFileContent = "\nThis is new content added to the file.";
// fs.appendFile(FILENAME, newFileContent, (err) => {
//     if (err) {
//         return console.log(err.message);
//     }
// });

// Renommer un fichier 
// try {
//     fs.renameSync(FILENAME, "renamed-file.txt");
// } catch (error) {
//     console.log(error);
// }

// Faire une copie d'un fichier
// fs.copyFile("renamed-file.txt", "copied-file.txt", (err) => {
//     if (err) {
//         return console.log(err.message);
//     }
//     console.log("File copied successfully...");
// });

// Lire le contenu d'un fichier
// fs.readFile("new_file_2_base64.txt", "utf-8", (err, data) => {
//     if(err) {
//         return console.log(err);
//     }
//     console.log(data);

//     fs.writeFile("new_file_2_base64.txt", data, (error) => {
//         if (error) {
//             return console.log(error.message);
//         }
//     } )
// })

fs.readFile("new_file_2_base64.txt", "utf-8", (err, data) => {
    if(err) {
        return console.log(err);
    }
    fs.writeFile("test2.txt", data, (errr) => {
        if (errr) {
            console.log(errr);
        }
    })
    // console.log(data);
})
// fs.readFile("copied-file.txt", "utf-8", (err, data) =>  {
//     if (err) {
//         return console.log(err.message);  
//     }
//     console.log("File content read successfully...");
//     console.log(data);
// })



// lire le contenu d'un repertoire
// fs.stat("new-directory", (err, stats) => {
//     if (err) {
//         console.log("Error getting directory stats...");
//     } else {
//         console.log("Directory stats:", stats.isDirectory());
//         fs.open("new-directory", (err, fd) => {
//             if (err) {
//                 console.log("Error opening directory...");
//             } else {
//                 console.log("Directory opened successfully...", fd);
//             }
//         })
//     }
// });

// fs.readdir("new-directory", (err, file) => {
//     if (err) {
//         console.log("Error reading folder content...");
//     }else {
//         fs.s
//         console.log("Folder content:", typeof file);
//     }
// });


// fs.rmdir(path.join(__dirname, "new-directory"), (err) => {return (err) ? console.log(err.message) : console.log("Directory removed ...")})
// Supprimer un fichier
// fs.unlink("copied-file.txt", (err) => {
//   if (err) {
//     return console.log(err.message);
//   }  
//   console.log("File removed ...");
// })