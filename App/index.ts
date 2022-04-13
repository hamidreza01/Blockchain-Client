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
import ndoesFunction from "./nodes";

const blockChain: _Blockchain = new Blockchain();

const port = Math.floor(Math.random() * 10000);

const nodes: _Nodes = new Nodes(port);

const app = express();

const wallet: _Wallet = new Wallet();

const transactionPool: _TransactionPool = new TransactionPool();
app.use(express.json());

app.post("/addTransaction", (req, res) => {
  const { recipient, amount }: any = req.body;
  let transaction: any = transactionPool.isHave(wallet);
  if (transaction !== undefined) {
    transaction.update(recipient, amount, wallet);
    return res.send(transactionPool.transactionMap);
  }
  transaction = wallet.createTransaction(recipient, amount);
  if (transaction.code) {
    return res.status(400).json(transaction);
  }
  transactionPool.add(transaction as _Transaction);
  res.send(transactionPool.transactionMap);
});


app.listen(2161, () => {
  console.log("app test in 2161");
});

rootFunction(blockChain, nodes, port + 2);
ndoesFunction(nodes, blockChain);
