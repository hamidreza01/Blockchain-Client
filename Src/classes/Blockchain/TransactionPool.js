"use strict";
exports.__esModule = true;
exports.TransactionPool = void 0;
var TransactionPool = /** @class */ (function () {
    function TransactionPool() {
        this.transactionMap = {};
    }
    TransactionPool.prototype.add = function (transaction) {
        this.transactionMap[transaction.id] = transaction;
    };
    TransactionPool.prototype.isHave = function (wallet) {
        var val = Object.values(this.transactionMap);
        return val.find(function (x) {
            return x.inputMap.address === wallet.publicKey;
        });
    };
    TransactionPool.prototype.clear = function () {
        this.transactionMap = {};
    };
    TransactionPool.prototype.clearBlockchainTransactions = function (chain) {
        for (var i = 0; i < chain.length; i++) {
            var block = chain[i];
            for (var j = 0; j < block.data.transaction.length; j++) {
                var tx = block.data.transaction[j];
                delete this.transactionMap[tx.id];
            }
        }
    };
    return TransactionPool;
}());
exports.TransactionPool = TransactionPool;
;
