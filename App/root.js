"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Root_1 = require("../Src/classes/Network/Root");
function default_1(blockChain, nodes, transactionPool, port) {
    const root = new Root_1.Root(port);
    root.start();
    //@ts-ignore
    root.send("addMe", { data: { hash: root.hash, port } });
    nodes.start();
    root.bet("welcome", (data) => {
        nodes.list = data.nodes;
        // blockChain.chain = data.chain;
        // transactionPool.transactionMap = data.transactionMap;
    });
    root.bet("sliceChain", (data) => {
        blockChain.chain = blockChain.chain.filter((x, i) => {
            return i < data;
        });
    });
    root.bet("reaplceChain", (data) => {
        blockChain.chain = data;
    });
    root.bet("replaceNodes", (data) => {
        nodes.list = data.nodes;
    });
    root.bet("newNode", (data) => {
        nodes.list.push(data);
    });
    root.bet("giveMeData", () => {
        root.send("giveMeData", {
            data: { chain: blockChain.chain, node: nodes.list },
        });
    });
}
exports.default = default_1;
