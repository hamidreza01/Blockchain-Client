"use strict";
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
exports.__esModule = true;
exports.TransactionMiner = void 0;
var Transaction_1 = require("./Transaction");
var TransactionMiner = /** @class */ (function () {
    function TransactionMiner(transactionPool, blockchain, wallet, nodes) {
        this.transactionPool = transactionPool;
        this.blockchain = blockchain;
        this.wallet = wallet;
        this.nodes = nodes;
    }
    TransactionMiner.prototype.mineTransaction = function () {
        var _this = this;
        return new Promise(function (res) {
            var transactions = __spreadArray([Transaction_1.Transaction.reward(_this.wallet)], Object.values(_this.transactionPool.transactionMap), true);
            _this.blockchain.addBlock({ transaction: transactions });
            _this.nodes.broadcast("chain", _this.blockchain.chain);
            _this.transactionPool.clear();
            res();
        });
    };
    return TransactionMiner;
}());
exports.TransactionMiner = TransactionMiner;
