"use strict";
exports.__esModule = true;
var Root_1 = require("../Src/classes/Network/Root");
function default_1(blockChain, nodes, transactionPool, port) {
    var root = new Root_1.Root(port);
    root
        .start()
        .then(function (value) {
        nodes.start(blockChain);
        root.addMe();
    })["catch"](function (err) {
        console.log(err);
    });
    root.bet("welcome", function (data) {
        nodes.list = data.nodeList;
        blockChain.chain = data.chain;
        transactionPool.transactionMap = data.transactionMap;
    });
    root.bet("sliceChain", function (data) {
        blockChain.chain = blockChain.chain.filter(function (x, i) {
            return i < data;
        });
    });
    root.bet("reaplceChain", function (data) {
        blockChain.chain = data;
    });
    root.bet("replaceNodes", function (data) {
        nodes.list = data;
    });
    root.bet("newNode", function (data) {
        nodes.list.push(data);
        console.log(nodes.list);
    });
    root.bet("giveMeData", function () {
        root.giveData(blockChain.chain, nodes.list);
    });
}
exports["default"] = default_1;
