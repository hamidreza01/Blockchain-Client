"use strict";
exports.__esModule = true;
var Root_1 = require("./Src/classes/Network/Root");
var Blockchain_1 = require("./Src/classes/Blockchain/Blockchain");
var Nodes_1 = require("./Src/classes/Network/Nodes");
var blockChain = new Blockchain_1.Blockchain();
var port = Math.floor(Math.random() * 10000);
var root = new Root_1.Root(port + 2);
var nodes = new Nodes_1.Nodes(port);
root
    .start()
    .then(function (value) {
    nodes.start(blockChain);
    root.addMe();
})["catch"](function (err) {
    console.log(err);
});
root.bet("welcome", function (data) {
    nodes.list = data;
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
