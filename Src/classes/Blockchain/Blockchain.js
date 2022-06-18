"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Blockchain = void 0;
const hash_creator_1 = require("../../Addon/hash-creator");
const Block_1 = require("./Block");
const config_1 = require("../../../config");
const Transaction_1 = require("./Transaction");
const Wallet_1 = require("./Wallet");
class Blockchain {
    constructor() {
        this.chain = [Block_1.Block.genesis()];
    }
    addBlock(data) {
        const block = Block_1.Block.mineBlock(this.chain[this.chain.length - 1], data);
        this.chain.push(block);
    }
    static isValid(chain) {
        if (JSON.stringify(chain[0]) !== JSON.stringify(Block_1.Block.genesis()))
            return false;
        for (let i = 1; i < chain.length; i++) {
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
    }
    replaceChain(chain) {
        if (chain.length < this.chain.length) {
            return { message: "chain is short", code: 101 };
        }
        if (!Blockchain.isValid(chain)) {
            return { message: "chain is not valid", code: 102 };
        }
        this.chain = chain;
        return true;
    }
    validTransactionData(chain) {
        var _a, _b, _c, _d, _e, _f;
        for (let i = 1; i < (chain === null || chain === void 0 ? void 0 : chain.length); i++) {
            if (((_c = (_b = (_a = chain[i]) === null || _a === void 0 ? void 0 : _a.data) === null || _b === void 0 ? void 0 : _b.transaction) === null || _c === void 0 ? void 0 : _c.length) < 1)
                return { message: "chain data is empty", code: 120 };
            for (let transaction of (_e = (_d = chain[i]) === null || _d === void 0 ? void 0 : _d.data) === null || _e === void 0 ? void 0 : _e.transaction) {
                let rewardNumber = 0;
                if (((_f = transaction === null || transaction === void 0 ? void 0 : transaction.inputMap) === null || _f === void 0 ? void 0 : _f.address) === config_1.config.REWARD_TRANSACTION.address) {
                    rewardNumber++;
                    if (rewardNumber > 1) {
                        return {
                            message: "reward transaction length is ivalid",
                            code: 122,
                        };
                    }
                    if (Object.values(transaction.outputMap).reduce((all, val) => (all + val)) > config_1.config.REWARD) {
                        return { message: "reward transaction is invalid", code: 121 };
                    }
                }
                else {
                    let transactionResualt = Transaction_1.Transaction.isValid(transaction);
                    if (transactionResualt !== true) {
                        return transactionResualt;
                    }
                    else {
                        const trueValue = Wallet_1.Wallet.calculateBalance(this.chain, transaction.inputMap.address);
                        if (trueValue !== transaction.inputMap.amount) {
                            return { message: "transaction amount is invalid", code: 123 };
                        }
                    }
                }
            }
        }
        return true;
    }
}
exports.Blockchain = Blockchain;
