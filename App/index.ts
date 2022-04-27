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

// import { _TransactionMiner } from "../Src/interfaces/Blockchain/_TransactionMiner";

// import { TransactionMiner } from "../Src/classes/Blockchain/TransactionMiner";

import cluster from "cluster";

import rootFunction from "./root";

import nodesFunction from "./nodes";

import { config } from "../config";

import { recoveryKeyPair } from "../Src/Addon/sign";

import { _Errors } from "../Src/types/errors_interface";

import { Transaction } from "../Src/classes/Blockchain/Transaction";

import fs from "fs";

import express from "express";

(async () => {
  console.log = () => {};
  if (cluster.isPrimary) {
    try {
      process.stdout.write("Developix Blockchain is running...");
      const app = express();
      let blockchain: _Blockchain;
      let nodes: _Nodes;
      let admin: _Wallet;
      let transactionPool: _TransactionPool;
      // let transactionMiner: _TransactionMiner;
      let start = false;
      let timer: any;
      // --- node api
      app.use((req, res, next) => {
        if (req.connection.localAddress === req.connection.remoteAddress) {
          next();
        } else {
          res.status(403).send("forbidden");
        }
      });

      app.use(express.json());

      app.post("/start", (req, res) => {
        try {
          blockchain = new Blockchain();
          nodes = new Nodes(config.NODE_PORT);
          admin = new Wallet();
          transactionPool = new TransactionPool();
          if (fs.existsSync("./chain.log")) {
            blockchain.chain = JSON.parse(
              fs.readFileSync("./chain.log").toString()
            );
          }
          setInterval(() => {
            fs.writeFileSync("./chain.log", JSON.stringify(blockchain.chain));
          }, 1000 * 60 * 60);
          rootFunction(
            blockchain,
            nodes,
            transactionPool,
            config.NODE_PORT + 2
          );
          nodesFunction(nodes, blockchain, transactionPool, admin, cluster);
          start = true;
          res.status(200).json({
            message: "node started",
            status: true,
            mainWallet: {
              publicKey: admin.publicKey,
              privateKey: admin.privateKey,
            },
          });
        } catch (err: any) {
          if (err) {
            res.status(500).json({
              message: err.message,
              status: false,
            });
          } else {
            res.status(500).json({
              message: "unknown error",
              status: false,
            });
          }
        }
      });

      app.post("/wallet/create", (req, res) => {
        try {
          if (!start) {
            return res.status(400).json({
              message: "node not started",
              status: false,
            });
          }
          const wallet = new Wallet();
          res.status(200).json({
            message: "wallet created",
            status: true,
            wallet: {
              publicKey: wallet.publicKey,
              privateKey: wallet.privateKey,
            },
          });
        } catch (err) {
          res.status(500).json({
            message: "wallet not created",
            status: false,
          });
        }
      });

      app.post("/wallet/balance/:publicKey", (req, res) => {
        try {
          if (!start) {
            return res.status(400).json({
              message: "node not started",
              status: false,
            });
          }
          const { publicKey }: any = req.params;
          const balance = Wallet.calculateBalance(blockchain.chain, publicKey);
          res.status(200).json({
            message: "wallet balance",
            status: true,
            wallet: {
              publicKey,
              balance,
            },
          });
        } catch (err) {
          res.status(500).json({
            message: "wallet balance not found",
            status: false,
          });
        }
      });

      app.post("/mine/stop", (req, res) => {
        try {
          if (!start) {
            return res.status(400).json({
              message: "node not started",
              status: false,
            });
          }
          for (let j = 0; j < Object.keys(cluster?.workers!).length; j++) {
            cluster.workers![j]?.kill();
          }
          clearInterval(timer);
          res.status(200).json({
            message: "mining stopped",
            status: true,
          });
        } catch (err) {
          res.status(500).json({
            message: "error mining",
            status: false,
          });
        }
      });

      app.post("/mine/start/:core", (req, res) => {
        try {
          if (!start) {
            return res.status(400).json({
              message: "node not started",
              status: false,
            });
          }
          const { core }: any = req.params;
          res.status(200).json({
            message: "mining started",
            status: true,
          });
          for (let i = 0; i < core; i++) {
            let worker = cluster.fork();
            timer = setInterval(() => {
              for (let j = 0; j < Object.keys(cluster?.workers!).length; j++) {
                cluster.workers![j]?.send({
                  chain: blockchain.chain,
                  transactions: [
                    Transaction.reward(admin),
                    ...Object.values(transactionPool.transactionMap),
                  ],
                });
              }
            }, 1000);
            cluster.on("message", (worker, message, handle) => {
              if (message.chain) {
                if (blockchain.replaceChain(message.chain) === true) {
                  nodes.broadcast("chain", blockchain.chain);
                  transactionPool.clear();
                }
              }
            });
          }
        } catch (err) {
          res.status(500).json({
            message: "error mining",
            status: false,
          });
        }
      });

      app.post("/transaction", (req, res) => {
        try {
          if (!start) {
            return res.status(400).json({
              message: "node not started",
              status: false,
            });
          }
          const { fromPublicKey, fromPrivateKey, toPublicKey, amount }: any =
            req.body;
          const wallet = new Wallet();
          wallet.keyPair = recoveryKeyPair(fromPrivateKey, fromPublicKey);
          wallet.privateKey = fromPrivateKey;
          wallet.publicKey = fromPublicKey;
          let hasTransaction = transactionPool.isHave(wallet);

          if (hasTransaction) {
            hasTransaction.update(toPublicKey, amount, wallet);
            return res.status(200).json({
              message: "transaction updated",
              status: true,
              hasTransaction,
            });
          }

          let transaction = wallet.createTransaction(
            toPublicKey,
            amount,
            blockchain.chain
          );
          if ((transaction as _Errors).code) {
            return res.status((transaction as _Errors).code).json({
              message: (transaction as _Errors).message,
              status: false,
            });
          }
          cluster.workers?.values?.send({
            chain: blockchain.chain,
            transactions: [
              Transaction.reward(admin),
              ...Object.values(transactionPool.transactionMap),
            ],
          });
          res.status(200).json({
            message: "transaction created",
            status: true,
            transaction,
          });
        } catch (err) {
          res.status(500).json({
            message: "transaction not created",
            status: false,
          });
        }
      });

      app.post("/chain/log", (req, res) => {
        try {
          if (!start) {
            return res.status(400).json({
              message: "node not started",
              status: false,
            });
          }
          const { location }: any = req.body;
          if (fs.existsSync(location)) {
            fs.unlinkSync(location);
            fs.writeFileSync(location, JSON.stringify(blockchain.chain));
          } else {
            fs.writeFileSync(location, JSON.stringify(blockchain.chain));
          }
          res.status(200).json({
            message: "chain loged",
            status: true,
            location,
          });
        } catch (err) {
          res.status(500).json({
            message: "chain log not saved",
            status: false,
          });
        }
      });

      app.post("/chain/restart", (req, res) => {
        try {
          if (!start) {
            return res.status(400).json({
              message: "node not started",
              status: false,
            });
          }
          blockchain = new Blockchain();
          transactionPool.clear();
          res.status(200).json({
            message: "chain restarted",
            status: true,
          });
        } catch (error) {
          res.status(500).json({
            message: "chain not restarted",
            status: false,
          });
        }
      });

      app.listen(7612, () => {
        console.log("node api run in port 7612");
      });
    } catch (error) {
      console.error(error);
    }
  } else {
    process.on("message", (data: any) => {
      let blockchain = new Blockchain();
      blockchain.chain = data.chain;
      let transactions: [_Transaction] = data.transactions;
      blockchain.addBlock({ transaction: transactions });
      (process.send as any)({ chain: blockchain.chain });
    });
  }
})();
