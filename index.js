"use strict";
exports.__esModule = true;
var Root_1 = require("./Src/classes/Network/Root");
var Blockchain_1 = require("./Src/classes/Blockchain/Blockchain");
var root = new Root_1.Root();
var blockChain = new Blockchain_1.Blockchain();
root
    .start()
    .then(function (value) {
    root.addMe();
})["catch"](function (err) {
    console.log(err);
});
root.bet("welcome", function (data) {
    console.log(data);
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
    // nodes.list = data;
});
root.bet("newNode", function (data) {
    // nodes.add(data)
});
root.bet("giveMeData", function () {
    // root.giveData(blockChain.chain , nodes.list)
});
