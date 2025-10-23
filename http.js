const https = require('node:https');
const http = require('node:http');
const fs = require('node:fs');

// http.request({
//     host: '127.0.0.1',
//     port: 3000,
//     method: "GET",
// }, (res) => {
//     res.on('end', () => {
//         res.complete()
//         console.log("Request ended");
//     })
// })

//  ============== Creer un serveur HTTP ================
const server = http.createServer((req, res) => {
    console.log("Request url:", req.url);    
    if (req.url === '/products')  {
        // lire le fichier products.json
        if (fs.existsSync("products.json")) {
            fs.readFile("products.json", "utf-8", (err, data) => {
                
                if (err) {
                    res.writeHead(500, {'Content-Type': 'application/json'});
                    res.end(JSON.stringify({error: 'Error reading products file'}));
                } else {
                    
                    res.writeHead(200, {'Content-Type': 'application/json'});
                    res.end(JSON.stringify(data));
                }
            })
        }
    } 
    else if (req.url == "/") {
        res.writeHead(200, {'Content-Type': 'application/json'});
        res.end("Welcome...");
    }
});

server.listen(3000, () => {
    console.log('Server is listening on port 3000');
});

// Utiliser node comme client HTTP : 
// const dummyJsonUrl = "https://dummyjson.com/products?limit=5";

// https.get(dummyJsonUrl, (res) => {
//     let data = "";
    
//     // Si erreur de reponse
//     res.on('error', (err) => {
//         console.error('Error fetching data:', {errMessage: err.message, errCode: res.statusCode});
//     })

//     // Recevoir les donnees par morceaux
//     res.on('data', (chunk) => {        
//         data += chunk;
//     });

//     // Quand toutes les donnees sont recues
//     res.on('end', () => {
//         try {
//             const parsedData = JSON.parse(data);
            
//             fs.writeFile("products.json", JSON.stringify(parsedData?.products), (err) => {
//                 if (err) {
//                     console.error('Error writing to file:', err.message);
//                 }
//             })
//             console.log('Received Data Written to products.json successfully.');
//         } catch (err) {
//             console.error('Error parsing JSON:', err.message);
//         }
//     })
// });

