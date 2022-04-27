"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Block = void 0;
const config_1 = require("../../../config");
const hash_creator_1 = require("../../Addon/hash-creator");
const hex_to_bin_1 = __importDefault(require("hex-to-bin"));
class Block {
    constructor(timestamp, data, hash, lastHash, nonce, difficulty) {
        this.timestamp = timestamp;
        this.data = data;
        this.hash = hash;
        this.lastHash = lastHash;
        this.nonce = nonce;
        this.difficulty = difficulty;
    }
    static genesis() {
        return config_1.config.GENESIS_DATA;
    }
    static mineBlock(lastBlock, data) {
        const { hash: lastHash } = lastBlock;
        let difficulty = lastBlock.difficulty;
        let nonce = 0;
        let hash, timestamp;
        do {
            nonce++;
            timestamp = Date.now();
            difficulty = Block.adJustDifficulty(lastBlock, timestamp);
            hash = (0, hash_creator_1.hashCreator)(lastHash, nonce.toString(), timestamp.toString(), JSON.stringify(data), difficulty.toString());
        } while ((0, hex_to_bin_1.default)(hash).slice(0, difficulty) !== "0".repeat(difficulty));
        {
            return new Block(timestamp, data, hash, lastHash, nonce, difficulty);
        }
    }
    static adJustDifficulty(lastBlock, timestamp) {
        if (lastBlock.difficulty < 1)
            return 1;
        if (timestamp - lastBlock.timestamp > config_1.config.MINE_RATE)
            return lastBlock.difficulty - 1;
        return lastBlock.difficulty + 1;
    }
}
exports.Block = Block;
