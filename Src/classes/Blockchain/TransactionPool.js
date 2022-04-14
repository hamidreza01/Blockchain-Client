"use strict";
exports.__esModule = true;
exports.TransactionPool = void 0;
var TransactionPool = /** @class */ (function () {
    function TransactionPool() {
        this.transactionMap = {};
    }
    TransactionPool.prototype.add = function (transaction) {
        // const check = Transaction.isValid(transaction)
        // if(check !== true){
        //     return check as _Errors;
        // } 
        this.transactionMap[transaction.id] = transaction;
    };
    TransactionPool.prototype.isHave = function (wallet) {
        var val = Object.values(this.transactionMap);
        return val.find(function (x) {
            return x.inputMap.address === wallet.publicKey;
        });
    };
    return TransactionPool;
}());
exports.TransactionPool = TransactionPool;
;
