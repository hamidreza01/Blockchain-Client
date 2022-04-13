"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
exports.__esModule = true;
var Blockchain_1 = require("../Src/classes/Blockchain/Blockchain");
var Nodes_1 = require("../Src/classes/Network/Nodes");
var express_1 = __importDefault(require("express"));
var Wallet_1 = require("../Src/classes/Blockchain/Wallet");
var TransactionPool_1 = require("../Src/classes/Blockchain/TransactionPool");
var root_1 = __importDefault(require("./root"));
var nodes_1 = __importDefault(require("./nodes"));
var blockChain = new Blockchain_1.Blockchain();
var port = Math.floor(Math.random() * 10000);
var nodes = new Nodes_1.Nodes(port);
var app = (0, express_1["default"])();
var wallet = new Wallet_1.Wallet();
var transactionPool = new TransactionPool_1.TransactionPool();
app.use(express_1["default"].json());
app.post("/addTransaction", function (req, res) {
    var _a = req.body, recipient = _a.recipient, amount = _a.amount;
    var transaction = transactionPool.isHave(wallet);
    if (transaction !== undefined) {
        transaction.update(recipient, amount, wallet);
        return res.send(transactionPool.transactionMap);
    }
    transaction = wallet.createTransaction(recipient, amount);
    if (transaction.code) {
        return res.status(400).json(transaction);
    }
    transactionPool.add(transaction);
    res.send(transactionPool.transactionMap);
});
app.listen(2161, function () {
    console.log("app test in 2161");
});
(0, root_1["default"])(blockChain, nodes, port + 2);
(0, nodes_1["default"])(nodes, blockChain);
