"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TransactionMiner = void 0;
const Transaction_1 = require("./Transaction");
class TransactionMiner {
    constructor(transactionPool, blockchain, wallet, nodes) {
        this.transactionPool = transactionPool;
        this.blockchain = blockchain;
        this.wallet = wallet;
        this.nodes = nodes;
    }
    mineTransaction() {
        return new Promise((res) => {
            const transactions = [Transaction_1.Transaction.reward(this.wallet), ...Object.values(this.transactionPool.transactionMap)];
            this.blockchain.addBlock({ transaction: transactions });
            this.nodes.broadcast("chain", this.blockchain.chain);
            this.transactionPool.clear();
            res();
        });
    }
}
exports.TransactionMiner = TransactionMiner;
