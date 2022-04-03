"use strict";
exports.__esModule = true;
var Blockchain_1 = require("./Src/classes/Blockchain/Blockchain");
var blockChain = new Blockchain_1.Blockchain();
// 
blockChain.addBlock(["data"]);
blockChain.addBlock(["data"]);
blockChain.addBlock(["data"]);
console.log(blockChain.chain);
// 
console.log(Blockchain_1.Blockchain.isValid(blockChain.chain));
