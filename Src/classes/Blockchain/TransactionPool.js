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
        var val = this.transactionMap.values();
        return val.find(function (x) { return x.inputMap.address === wallet.publicKey; });
    };
    return TransactionPool;
}());
exports.TransactionPool = TransactionPool;
;
