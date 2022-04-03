"use strict";
exports.__esModule = true;
exports.config = void 0;
var DEFUALT_DIFFICULTY = 3;
exports.config = {
    MINE_RATE: 1000,
    GENESIS_DATA: {
        hash: "DEXhash",
        lastHash: "dexLastHash",
        nonce: 0,
        difficulty: DEFUALT_DIFFICULTY,
        timestamp: 0,
        data: ["DEX-BlockChain"]
    },
    DEFUALT_BALANCE: 0
};
