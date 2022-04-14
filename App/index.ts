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
import rootFunction from "./root";
import nodesFunction from "./nodes";

const blockChain: _Blockchain = new Blockchain();

const port = Math.floor(Math.random() * 10000);

const nodes: _Nodes = new Nodes(port);

const app = express();

const wallet: _Wallet = new Wallet();

const transactionPool: _TransactionPool = new TransactionPool();
app.use(express.json())
app.post("/addTransaction", (req, res) => {
  const { recipient, amount }: any = req.body;
  console.log(recipient)
  let transaction: any;
  transaction = transactionPool.isHave(wallet);
  if (transaction !== undefined) {
    transaction.update(recipient, amount, wallet);
    return res.send(transactionPool.transactionMap);
  }
  transaction = wallet.createTransaction(recipient, amount);
  if (transaction.code) {
    return res.status(400).json(transaction);
  }
  transactionPool.add(transaction as _Transaction);
  nodes.broadcast("transaction", transaction);
  res.send(transactionPool.transactionMap);
});
app.listen(3103, () => {
  console.log("Api run in", 3103);
})
rootFunction(blockChain, nodes, transactionPool, port + 2);
nodesFunction(nodes, blockChain, transactionPool);
