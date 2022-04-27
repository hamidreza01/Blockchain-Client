"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Blockchain_1 = require("../Src/classes/Blockchain/Blockchain");
const Nodes_1 = require("../Src/classes/Network/Nodes");
const Wallet_1 = require("../Src/classes/Blockchain/Wallet");
const TransactionPool_1 = require("../Src/classes/Blockchain/TransactionPool");
const cluster_1 = __importDefault(require("cluster"));
const root_1 = __importDefault(require("./root"));
const nodes_1 = __importDefault(require("./nodes"));
const config_1 = require("../config");
const sign_1 = require("../Src/Addon/sign");
const Transaction_1 = require("../Src/classes/Blockchain/Transaction");
const fs_1 = __importDefault(require("fs"));
const express_1 = __importDefault(require("express"));
(() => __awaiter(void 0, void 0, void 0, function* () {
    console.log = () => { };
    if (cluster_1.default.isPrimary) {
        try {
            process.stdout.write("Developix Blockchain is running...");
            const app = (0, express_1.default)();
            let blockchain;
            let nodes;
            let admin;
            let transactionPool;
            // let transactionMiner: _TransactionMiner;
            let start = false;
            let timer;
            // --- node api
            app.use((req, res, next) => {
                if (req.connection.localAddress === req.connection.remoteAddress) {
                    next();
                }
                else {
                    res.status(403).send("forbidden");
                }
            });
            app.use(express_1.default.json());
            app.post("/start", (req, res) => {
                try {
                    blockchain = new Blockchain_1.Blockchain();
                    nodes = new Nodes_1.Nodes(config_1.config.NODE_PORT);
                    admin = new Wallet_1.Wallet();
                    transactionPool = new TransactionPool_1.TransactionPool();
                    if (fs_1.default.existsSync("./chain.log")) {
                        blockchain.chain = JSON.parse(fs_1.default.readFileSync("./chain.log").toString());
                    }
                    setInterval(() => {
                        fs_1.default.writeFileSync("./chain.log", JSON.stringify(blockchain.chain));
                    }, 1000 * 60 * 60);
                    (0, root_1.default)(blockchain, nodes, transactionPool, config_1.config.NODE_PORT + 2);
                    (0, nodes_1.default)(nodes, blockchain, transactionPool, admin, cluster_1.default);
                    start = true;
                    res.status(200).json({
                        message: "node started",
                        status: true,
                        mainWallet: {
                            publicKey: admin.publicKey,
                            privateKey: admin.privateKey,
                        },
                    });
                }
                catch (err) {
                    if (err) {
                        res.status(500).json({
                            message: err.message,
                            status: false,
                        });
                    }
                    else {
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
                    const wallet = new Wallet_1.Wallet();
                    res.status(200).json({
                        message: "wallet created",
                        status: true,
                        wallet: {
                            publicKey: wallet.publicKey,
                            privateKey: wallet.privateKey,
                        },
                    });
                }
                catch (err) {
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
                    const { publicKey } = req.params;
                    const balance = Wallet_1.Wallet.calculateBalance(blockchain.chain, publicKey);
                    res.status(200).json({
                        message: "wallet balance",
                        status: true,
                        wallet: {
                            publicKey,
                            balance,
                        },
                    });
                }
                catch (err) {
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
                    for (let i of cluster_1.default.workers) {
                        i.send({ 'stop': true });
                    }
                    clearInterval(timer);
                    res.status(200).json({
                        message: "mining stopped",
                        status: true,
                    });
                }
                catch (err) {
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
                    const { core } = req.params;
                    res.status(200).json({
                        message: "mining started",
                        status: true,
                    });
                    for (let i = 0; i < core; i++) {
                        let worker = cluster_1.default.fork();
                        timer = setInterval(() => {
                            worker.send({
                                chain: blockchain.chain,
                                transactions: [
                                    Transaction_1.Transaction.reward(admin),
                                    ...Object.values(transactionPool.transactionMap),
                                ],
                            });
                        }, 1000);
                        cluster_1.default.on("message", (worker, message, handle) => {
                            if (message.chain) {
                                if (blockchain.replaceChain(message.chain) === true) {
                                    nodes.broadcast("chain", blockchain.chain);
                                    transactionPool.clear();
                                }
                            }
                        });
                    }
                }
                catch (err) {
                    res.status(500).json({
                        message: "error mining",
                        status: false,
                    });
                }
            });
            app.post("/transaction", (req, res) => {
                var _a, _b;
                try {
                    if (!start) {
                        return res.status(400).json({
                            message: "node not started",
                            status: false,
                        });
                    }
                    const { fromPublicKey, fromPrivateKey, toPublicKey, amount } = req.body;
                    const wallet = new Wallet_1.Wallet();
                    wallet.keyPair = (0, sign_1.recoveryKeyPair)(fromPrivateKey, fromPublicKey);
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
                    let transaction = wallet.createTransaction(toPublicKey, amount, blockchain.chain);
                    if (transaction.code) {
                        return res.status(transaction.code).json({
                            message: transaction.message,
                            status: false,
                        });
                    }
                    (_b = (_a = cluster_1.default.workers) === null || _a === void 0 ? void 0 : _a.values) === null || _b === void 0 ? void 0 : _b.send({
                        chain: blockchain.chain,
                        transactions: [
                            Transaction_1.Transaction.reward(admin),
                            ...Object.values(transactionPool.transactionMap),
                        ],
                    });
                    res.status(200).json({
                        message: "transaction created",
                        status: true,
                        transaction,
                    });
                }
                catch (err) {
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
                    const { location } = req.body;
                    if (fs_1.default.existsSync(location)) {
                        fs_1.default.unlinkSync(location);
                        fs_1.default.writeFileSync(location, JSON.stringify(blockchain.chain));
                    }
                    else {
                        fs_1.default.writeFileSync(location, JSON.stringify(blockchain.chain));
                    }
                    res.status(200).json({
                        message: "chain loged",
                        status: true,
                        location,
                    });
                }
                catch (err) {
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
                    blockchain = new Blockchain_1.Blockchain();
                    transactionPool.clear();
                    res.status(200).json({
                        message: "chain restarted",
                        status: true,
                    });
                }
                catch (error) {
                    res.status(500).json({
                        message: "chain not restarted",
                        status: false,
                    });
                }
            });
            app.listen(7612, () => {
                console.log("node api run in port 7612");
            });
        }
        catch (error) {
            console.error(error);
        }
    }
    else {
        process.on("message", (data) => {
            if (data.stop) {
                return process.exit(0);
            }
            let blockchain = new Blockchain_1.Blockchain();
            blockchain.chain = data.chain;
            let transactions = data.transactions;
            blockchain.addBlock({ transaction: transactions });
            process.send({ chain: blockchain.chain });
        });
    }
}))();
