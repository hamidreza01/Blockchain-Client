"use strict";
exports.__esModule = true;
exports.Blockchain = void 0;
var hash_creator_1 = require("../../Addon/hash-creator");
var Block_1 = require("./Block");
var Blockchain = /** @class */ (function () {
    function Blockchain() {
        this.chain = [Block_1.Block.genesis()];
    }
    Blockchain.prototype.addBlock = function (data) {
        var block = Block_1.Block.mineBlock(this.chain[this.chain.length - 1], data);
        this.chain.push(block);
    };
    Blockchain.isValid = function (chain) {
        if (JSON.stringify(chain[0]) !== JSON.stringify(Block_1.Block.genesis()))
            return false;
        for (var i = 1; i < chain.length; i++) {
            if (chain[i].hash !==
                (0, hash_creator_1.hashCreator)(chain[i].lastHash, JSON.stringify(chain[i].data), chain[i].nonce.toString(), chain[i].difficulty.toString(), chain[i].timestamp.toString())) {
                return false;
            }
            if (chain[i].lastHash !== chain[i - 1].hash) {
                return false;
            }
            if (Math.abs(chain[i - 1].difficulty - chain[i].difficulty) > 1) {
                return false;
            }
        }
        return true;
    };
    Blockchain.prototype.replaceChain = function (chain) {
        if (chain.length < this.chain.length) {
            return { message: "chain is short", code: 101 };
        }
        if (!Blockchain.isValid(chain)) {
            return { message: "chain is not valid", code: 102 };
        }
        this.chain = chain;
        return true;
    };
    return Blockchain;
}());
exports.Blockchain = Blockchain;
