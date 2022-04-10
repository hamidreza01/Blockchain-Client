"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
exports.__esModule = true;
exports.Transaction = void 0;
var uniqid_1 = __importDefault(require("uniqid"));
var sign_1 = require("../../Addon/sign");
var Transaction = /** @class */ (function () {
    function Transaction(senderWallet, amount, recpient) {
        this.id = (0, uniqid_1["default"])();
        this.outputMap = {};
        this.inputMap = {
            timestamp: 0,
            address: "",
            amount: 0,
            signature: { s: "", r: "" }
        };
        (this.outputMap = this.outputMapCreator(senderWallet, amount, recpient)),
            (this.inputMap = this.inputMapCreator(senderWallet, this.outputMap));
    }
    Transaction.prototype.inputMapCreator = function (senderWallet, outputMap) {
        return {
            timestamp: Date.now(),
            address: senderWallet.publicKey,
            amount: senderWallet.balance,
            signature: senderWallet.sign(outputMap)
        };
    };
    Transaction.prototype.outputMapCreator = function (senderWallet, amount, recipient) {
        var outputMap = {};
        outputMap[senderWallet.publicKey] = senderWallet.balance - amount;
        outputMap[recipient] = amount;
        return outputMap;
    };
    Transaction.prototype.update = function (recpient, amount, senderWallet) {
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
    };
    Transaction.isValid = function (transaction) {
        var total = Object.values(transaction.outputMap).reduce(function (all, val) {
            return all + val;
        });
        if (total !== transaction.inputMap.amount) {
            return {
                message: "invalid transaction from ".concat(transaction.inputMap.address),
                code: 111
            };
        }
        if (!(0, sign_1.verify)(transaction.outputMap, transaction.inputMap.signature, transaction.inputMap.address)) {
            return {
                message: "invalid transaction from ".concat(transaction.inputMap.address),
                code: 112
            };
        }
        return true;
    };
    return Transaction;
}());
exports.Transaction = Transaction;
