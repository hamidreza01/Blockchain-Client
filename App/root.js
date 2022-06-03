"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Root_1 = require("../Src/classes/Network/Root");
const uniqid_1 = __importDefault(require("uniqid"));
function default_1(blockChain, nodes, transactionPool, port) {
    const root = new Root_1.Root(port);
    root.start();
    root.send("addMe", { hash: (0, uniqid_1.default)() });
    nodes.start();
    root.bet("welcome", (data) => {
        nodes.list = data.nodeList;
        blockChain.chain = data.chain;
        transactionPool.transactionMap = data.transactionMap;
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
        nodes.list = data;
    });
    root.bet("newNode", (data) => {
        nodes.list.push(data);
    });
    root.bet("giveMeData", () => {
        root.send("giveMeData", { chain: blockChain.chain, node: nodes.list });
    });
}
exports.default = default_1;
