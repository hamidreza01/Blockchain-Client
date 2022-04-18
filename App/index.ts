import { Blockchain } from "../Src/classes/Blockchain/Blockchain";

import { _Blockchain } from "../Src/interfaces/Blockchain/_Blockchain";

import { _Block } from "../Src/interfaces/Blockchain/_Block";

import { Nodes } from "../Src/classes/Network/Nodes";

import { _Nodes } from "../Src/interfaces/Network/_Nodes";

import { Wallet } from "../Src/classes/Blockchain/Wallet";

import { _Wallet } from "../Src/interfaces/Blockchain/_Wallet";

import { TransactionPool } from "../Src/classes/Blockchain/TransactionPool";

import { _TransactionPool } from "../Src/interfaces/Blockchain/_TransactionPool";

import { _Transaction } from "../Src/interfaces/Blockchain/_Transaction";

import { Transaction } from "../Src/classes/Blockchain/Transaction";

import { _TransactionMiner } from "../Src/interfaces/Blockchain/_TransactionMiner";

import { TransactionMiner } from "../Src/classes/Blockchain/TransactionMiner";

import { Command } from "commander";

import { createServer } from "net";

import cluster from "cluster";

import rootFunction from "./root";

import nodesFunction from "./nodes";

import { recoveryKeyPair } from "../Src/Addon/sign";

let blockChain: _Blockchain;

const port = Math.floor(Math.random() * 10000);

const nodes: _Nodes = new Nodes(port);

const transactionPool: _TransactionPool = new TransactionPool();

let transactionMiner: _TransactionMiner;

blockChain = new Blockchain();
const mainWallet: _Wallet = new Wallet();
transactionMiner = new TransactionMiner(
  transactionPool,
  blockChain,
  mainWallet,
  nodes
);

const cli = new Command();

let Wallets: Array<_Wallet> = [];

let thisSocket: any;

cli.version("1.0.0");

cli
  .command("start")
  .description("start the node")
  .option("-a, --api", "enable api response")
  .action((option) => {
    rootFunction(blockChain, nodes, transactionPool, port + 2);
    nodesFunction(nodes, blockChain, transactionPool);
    setTimeout(() => {
      if (option.api) {
        return thisSocket.write(
          JSON.stringify({
            msg: {
              status: "started",
              mainWallet: {
                publicKey: mainWallet.publicKey,
                privateKey: mainWallet.privateKey,
              },
            },
          })
        );
      }
      thisSocket.write(
        JSON.stringify({
          msg: `node has been started. \n your main Wallet publicKey is: ${mainWallet.publicKey} \n your main Wallet privateKey is: ${mainWallet.privateKey}`,
        })
      );
    });
  });

cli
  .command("wallet")
  .description("manage your node wallets")
  .option("-a, --api", "enable api response")
  .option("-c, --create", "create a wallet")
  .option("-b, --balance <publicKey>", "balance of wallet with address")
  .action((option) => {
    if (option.create) {
      const wallet = new Wallet();
      if (option.api) {
        return thisSocket.write(
          JSON.stringify({
            msg: {
              status: "created",
              wallet: {
                publicKey: wallet.publicKey,
                privateKey: wallet.privateKey,
              },
            },
          })
        );
      }
      console.log(
        `wallet created with publicKey: ${wallet.publicKey}\n and privateKey: ${wallet.privateKey}`
      );
    }
    if (option.balance) {
      Wallet.calculateBalance(blockChain.chain, option.balance);
    }
  });

cli
  .command("mine")
  .description("start mining")
  .option("-a, --api", "enable api response")
  .option("-c, --core <number>", "select cpu core for mining")
  .action((option) => {
    option.core = option.core ? option.core : 0;
    if (cluster.isPrimary) {
      for (var i = 0; i < option.core; i++) {
        cluster.fork();
      }
    } else {
      const starter = async () => {
        transactionMiner.mineTransaction().then(() => {
          console.dir(`mine block in ${Date.now()}`);
          starter();
        });
      };
      starter();
    }
    if (option.api) {
      return console.log(
        JSON.stringify({ status: "started", miner: process.pid })
      );
    }
    console.log("mining started in " + process.pid);
  });

cli
  .command("transaction")
  .description("manage your node transactions")
  .option("-a, --api", "enable api response")
  .option("-fpub,--fromPublic <publicKey>", "from public address")
  .option("-fpri,--fromPrivate <privateKey>", "from private address")
  .option("-tpub,--toPublic <publicKey>", "to public address")
  .option("-v,--value <number>", "Transfer Value")
  .action((option) => {
    if (
      option.fromPublic &&
      option.fromPrivate &&
      option.value &&
      option.toPublic
    ) {
      const wallet = new Wallet();
      wallet.keyPair = recoveryKeyPair(option.fromPrivate, option.fromPublic);
      wallet.privateKey = option.fromPrivate;
      wallet.publicKey = option.fromPublic;
      let add = wallet.createTransaction(
        option.toPublic,
        option.value,
        blockChain.chain
      ) as any;
      if (add?.code) {
        if (option.api) {
          return console.log(add);
        }
        return console.log(add?.message);
      }
      transactionPool.add(add);
      if (option.api) {
        return console.log(JSON.stringify(""));
      }
    }
  });

const server = createServer();
server.on("connection", (socket) => {
  thisSocket = socket;
  socket.on("data", (data: any) => {
    data = data.toString();
    thisSocket = socket;
    cli.parse(data);
  });
});
