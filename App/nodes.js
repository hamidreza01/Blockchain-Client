"use strict";
exports.__esModule = true;
function default_1(nodes, blockchain) {
    nodes.bet("replaceChain", function (data) {
        blockchain.replaceChain(data);
    });
}
exports["default"] = default_1;
