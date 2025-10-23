const {createReadStream, createWriteStream} = require("fs");
const { pipeline } = require("stream");
const zlib = require("zlib");

const rs = createReadStream("./files/small_copy.txt");
const ws = createWriteStream("./files/small_copy_unzip.txt");
const zip = zlib.createGzip();
const unzip  = zlib.createGunzip();

// pipeline(
//     rs,
//     zip,
//     ws,
//     (err) => {
//         if (err) {
//             console.error("Pipeline failed:", err);
//         }else {
//             console.log("Compressed...");
//         }  
//     }
// )

pipeline(
    rs,
    unzip,
    ws,
    (err) => {
        if (err) {
            console.error("Pipeline failed:", err);
        }else {
            console.log("Decompressed...");
        }  
    }
)