"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TransactionPool = void 0;
class TransactionPool {
    constructor() {
        this.transactionMap = {};
    }
    add(transaction) {
        this.transactionMap[transaction.id] = transaction;
    }
    isHave(wallet) {
        let val = Object.values(this.transactionMap);
        return val.find(x => {
            return x.inputMap.address === wallet.publicKey;
        });
    }
    clear() {
        this.transactionMap = {};
    }
    clearBlockchainTransactions(chain) {
        for (let i = 1; i < chain.length; i++) {
            const block = chain[i];
            for (let j = 1; j < block.data.transaction.length; j++) {
                const tx = block.data.transaction[j];
                delete this.transactionMap[tx.id];
            }
        }
    }
}
exports.TransactionPool = TransactionPool;
;
