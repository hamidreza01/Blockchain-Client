"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Transaction_1 = require("../Src/classes/Blockchain/Transaction");
function default_1(nodes, blockchain, transactionPool, admin, cluster) {
    nodes.bet("chain", (data) => {
        if (blockchain.validTransactionData(data) === true && blockchain.replaceChain(data) === true) {
            transactionPool.clearBlockchainTransactions(data);
        }
        ;
    });
    nodes.bet("transaction", (data) => {
        var _a, _b;
        const check = Transaction_1.Transaction.isValid(data);
        if (check !== true) {
            return;
        }
        transactionPool.add(data);
        (_b = (_a = cluster.workers) === null || _a === void 0 ? void 0 : _a.values) === null || _b === void 0 ? void 0 : _b.send({
            chain: blockchain.chain,
            transactions: [Transaction_1.Transaction.reward(admin), ...Object.values(transactionPool.transactionMap)]
        });
    });
}
exports.default = default_1;
