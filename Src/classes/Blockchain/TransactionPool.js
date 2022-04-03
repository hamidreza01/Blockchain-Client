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
    return TransactionPool;
}());
exports.TransactionPool = TransactionPool;
;
