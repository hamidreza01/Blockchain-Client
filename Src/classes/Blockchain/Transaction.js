"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Transaction = void 0;
const uniqid_1 = __importDefault(require("uniqid"));
const sign_1 = require("../../Addon/sign");
const config_1 = require("../../../config");
class Transaction {
    constructor(senderWallet, amount, recpient, inputMap, outputMap) {
        this.id = (0, uniqid_1.default)();
        this.outputMap = {};
        this.inputMap = {
            timestamp: 0,
            address: "",
            amount: 0,
            signature: { s: "", r: "" },
        };
        (this.outputMap = outputMap || this.outputMapCreator(senderWallet, amount, recpient)),
            (this.inputMap = inputMap || this.inputMapCreator(senderWallet, this.outputMap));
    }
    inputMapCreator(senderWallet, outputMap) {
        return {
            timestamp: Date.now(),
            address: senderWallet.publicKey,
            amount: senderWallet.balance,
            signature: senderWallet.sign(outputMap),
        };
    }
    outputMapCreator(senderWallet, amount, recipient) {
        let outputMap = {};
        outputMap[senderWallet.publicKey] = senderWallet.balance - amount;
        outputMap[recipient] = amount;
        return outputMap;
    }
    update(recpient, amount, senderWallet) {
        if (this.outputMap[senderWallet.publicKey] < amount) {
            return { message: "amount exceeds balance", code: 112 };
        }
        if (this.outputMap[recpient]) {
            this.outputMap[recpient] += amount;
        }
        else {
            this.outputMap[recpient] = amount;
        }
        this.inputMap = this.inputMapCreator(senderWallet, this.outputMap);
    }
    static isValid(transaction) {
        let total = Object.values(transaction.outputMap).reduce((all, val) => {
            return all + val;
        });
        if (total !== transaction.inputMap.amount) {
            return {
                message: `invalid transaction from ${transaction.inputMap.address}`,
                code: 111,
            };
        }
        if (!(0, sign_1.verify)(transaction.outputMap, transaction.inputMap.signature, transaction.inputMap.address)) {
            return {
                message: `invalid transaction from ${transaction.inputMap.address}`,
                code: 112,
            };
        }
        return true;
    }
    static reward(minerWallet) {
        return new Transaction(minerWallet, 0, minerWallet.publicKey, config_1.config.REWARD_TRANSACTION, { [minerWallet.publicKey]: config_1.config.REWARD });
    }
}
exports.Transaction = Transaction;
