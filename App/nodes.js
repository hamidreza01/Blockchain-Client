"use strict";
exports.__esModule = true;
var Transaction_1 = require("../Src/classes/Blockchain/Transaction");
function default_1(nodes, blockchain, transactionPool) {
    nodes.bet("chain", function (data) {
        blockchain.replaceChain(data);
    });
    nodes.bet("transaction", function (data) {
        var check = Transaction_1.Transaction.isValid(data);
        if (check !== true) {
            return;
        }
        transactionPool.add(data);
    });
}
exports["default"] = default_1;
