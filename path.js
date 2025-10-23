// ========================== COMMONJS MODULE SYSTEM =========================
// const URL = require("url");
// const {add, subtract} = require("./math-lib");
// const mathLib = require("./math-lib");
// const [a, b] = [5,8]; 
// console.log(a + b);

// const url = "http://www.example.com:8080/path/name?query=string#hash";

// const parsedUrl = new URL(url)
// console.log(parsedUrl); 

// console.log(add(5, 8));
// console.log(subtract(10, 4));


// ========================== ES MODULE SYSTEM =========================
// import { add, subtract } from "./math-lib.js";
// import * as mathLib  from "./math-lib.js";

// const [a, b] = [5, 8];
// console.log(`Addition : ${mathLib.add(a, b)}`);
// console.log(`Soustraction : ${mathLib.subtract(a, b)}`);

// import * as path from "path";
const path = require("path");

console.log(path.sep);

console.log(path.basename("./files/small.txt"));
console.log(path.resolve("./"));
console.log(__dirname);
console.log(__filename);
console.log(path.extname("index.html"));


path.join("images", "phone", "phone.txt");
console.log(path.join("images", "pc", "pc.txt"));
const route = "./folder/subfolder///file.txt";



console.log(path.normalize(route));

