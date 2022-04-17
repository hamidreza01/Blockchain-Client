import { Blockchain } from "../Src/classes/Blockchain/Blockchain";
import { _Blockchain } from "../Src/interfaces/Blockchain/_Blockchain";
import { _Block } from "../Src/interfaces/Blockchain/_Block";
import { Nodes } from "../Src/classes/Network/Nodes";
import { _Nodes } from "../Src/interfaces/Network/_Nodes";
import express from "express";
import { Wallet } from "../Src/classes/Blockchain/Wallet";
import { _Wallet } from "../Src/interfaces/Blockchain/_Wallet";
import { TransactionPool } from "../Src/classes/Blockchain/TransactionPool";
import { _TransactionPool } from "../Src/interfaces/Blockchain/_TransactionPool";
import { _Transaction } from "../Src/interfaces/Blockchain/_Transaction";
import { Transaction } from "../Src/classes/Blockchain/Transaction";
import { _TransactionMiner } from "../Src/interfaces/Blockchain/_TransactionMiner"
import { TransactionMiner } from "../Src/classes/Blockchain/TransactionMiner";
import rootFunction from "./root";
import nodesFunction from "./nodes";
const blockChain: _Blockchain = new Blockchain();

const port = Math.floor(Math.random() * 10000);

const nodes: _Nodes = new Nodes(port);

const app = express();

const wallet: _Wallet = new Wallet();

const transactionPool: _TransactionPool = new TransactionPool();

const transactionMiner : _TransactionMiner = new TransactionMiner(transactionPool,blockChain,wallet,nodes);



rootFunction(blockChain, nodes, transactionPool, port + 2);
nodesFunction(nodes, blockChain, transactionPool);
// const testVal = new Wallet();
// testVal.balance = 1000;
// blockChain.addBlock({transaction : [new Transaction(testVal,200,wallet.publicKey)]})

transactionMiner.mineTransaction();

transactionMiner.mineTransaction();

transactionMiner.mineTransaction();
transactionPool.add(wallet.createTransaction('address', 1, blockChain.chain) as _Transaction);

transactionMiner.mineTransaction();

// console.dir(blockChain.chain, { depth: null });
console.log(Wallet.calculateBalance(blockChain.chain, wallet.publicKey));


console.log(Blockchain.isValid(blockChain.chain));
console.log(blockChain.validTransactionData(blockChain.chain));
// console.log(Wallet.calculateBalance(blockChain.chain, wallet.publicKey));