"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Transaction_1 = require("../Src/classes/Blockchain/Transaction");
function default_1(nodes, blockchain, transactionPool, admin, cluster) {
    nodes.bet("chain", (data) => {
        console.log('new chain : \n', data);
        if (blockchain.validTransactionData(data) === true && blockchain.replaceChain(data) === true) {
            transactionPool.clearBlockchainTransactions(data);
        }
        ;
    });
    nodes.bet("transaction", (data) => {
        const check = Transaction_1.Transaction.isValid(data);
        if (check !== true) {
            return;
        }
        transactionPool.add(data);
    });
}
exports.default = default_1;
