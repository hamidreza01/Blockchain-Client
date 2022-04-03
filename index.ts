import { Blockchain } from "./Src/classes/Blockchain/Blockchain";
const blockChain = new Blockchain();
// 

blockChain.addBlock(["data"]);
blockChain.addBlock(["data"]);
blockChain.addBlock(["data"]);
console.log(blockChain.chain)

// 
console.log(Blockchain.isValid(blockChain.chain));
