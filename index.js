"use strict";
exports.__esModule = true;
var Wallet_1 = require("./Src/classes/Blockchain/Wallet");
var Transaction_1 = require("./Src/classes/Blockchain/Transaction");
var wallet = new Wallet_1.Wallet();
var transaction = new Transaction_1.Transaction(wallet, 10, 'teiajsdijasd213asdiohasoidhiasdias123st');
console.log(Transaction_1.Transaction.isValid(transaction));
