"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
exports.__esModule = true;
exports.Block = void 0;
var config_1 = require("../../../config");
var hash_creator_1 = require("../../Addon/hash-creator");
var hex_to_bin_1 = __importDefault(require("hex-to-bin"));
var Block = /** @class */ (function () {
    function Block(timestamp, data, hash, lastHash, nonce, difficulty) {
        this.timestamp = timestamp;
        this.data = data;
        this.hash = hash;
        this.lastHash = lastHash;
        this.nonce = nonce;
        this.difficulty = difficulty;
    }
    Block.genesis = function () {
        return config_1.config.GENESIS_DATA;
    };
    Block.mineBlock = function (lastBlock, data) {
        var lastHash = lastBlock.hash;
        var difficulty = lastBlock.difficulty;
        var nonce = 0;
        var hash, timestamp;
        do {
            nonce++;
            timestamp = Date.now();
            difficulty = Block.adJustDifficulty(lastBlock, timestamp);
            hash = (0, hash_creator_1.hashCreator)(lastHash, nonce.toString(), timestamp.toString(), JSON.stringify(data), difficulty.toString());
        } while ((0, hex_to_bin_1["default"])(hash).slice(0, difficulty) !== "0".repeat(difficulty));
        {
            return new Block(timestamp, data, hash, lastHash, nonce, difficulty);
        }
    };
    Block.adJustDifficulty = function (lastBlock, timestamp) {
        if (lastBlock.difficulty < 1)
            return 1;
        if (timestamp - lastBlock.timestamp > config_1.config.MINE_RATE)
            return lastBlock.difficulty - 1;
        return lastBlock.difficulty + 1;
    };
    return Block;
}());
exports.Block = Block;
