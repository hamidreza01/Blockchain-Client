"use strict";
exports.__esModule = true;
exports.config = void 0;
var DEFUALT_DIFFICULTY = 3;
var ADMIN = {
    httpIP: "localhost:45451"
};
var REWARD_TRANSACTION = {
    address: '**DPX Blockchain**'
};
var REWARD = 1;
exports.config = {
    ADMIN: ADMIN,
    MINE_RATE: 1000,
    ROOT_URL: "127.0.0.1",
    ROOT_PORT: 3000,
    GENESIS_DATA: {
        hash: "DEFAULT-DPX-GENESIS-HASH",
        lastHash: "DEFAULT-DPX-LAST-HASH",
        nonce: 0,
        difficulty: DEFUALT_DIFFICULTY,
        timestamp: 0,
        data: {}
    },
    DEFUALT_BALANCE: 0,
    REWARD_TRANSACTION: REWARD_TRANSACTION,
    REWARD: REWARD
};
