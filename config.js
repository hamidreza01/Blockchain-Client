"use strict";
exports.__esModule = true;
exports.config = void 0;
var DEFUALT_DIFFICULTY = 3;
exports.config = {
    MINE_RATE: 1000,
    ROOT_URL: "127.0.0.1",
    ROOT_PORT: 3000,
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
