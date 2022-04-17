"use strict";
exports.__esModule = true;
exports.Wallet = void 0;
var sign_1 = require("../../Addon/sign");
var config_1 = require("../../../config");
var hash_creator_1 = require("../../Addon/hash-creator");
var Transaction_1 = require("./Transaction");
var Wallet = /** @class */ (function () {
    function Wallet() {
        this.balance = config_1.config.DEFUALT_BALANCE;
        this.keyPair = sign_1.ec.genKeyPair();
        this.publicKey = this.keyPair.getPublic().encode("hex");
    }
    Wallet.prototype.sign = function (data) {
        return this.keyPair.sign((0, hash_creator_1.hashCreator)(JSON.stringify(data)));
    };
    Wallet.prototype.createTransaction = function (recipient, amount, chain) {
        this.balance = Wallet.calculateBalance(chain, this.publicKey);
        // console.log(amount , this.balance)
        if (amount > this.balance) {
            return { message: "amount exceeds balance", code: 112 };
        }
        return new Transaction_1.Transaction(this, amount, recipient);
    };
    Wallet.calculateBalance = function (chain, address) {
        var _a, _b, _c;
        var value = 0;
        var hasTransaction = false;
        for (var i = (chain === null || chain === void 0 ? void 0 : chain.length) - 1; i > 0; i--) {
            for (var _i = 0, _d = (_b = (_a = chain[i]) === null || _a === void 0 ? void 0 : _a.data) === null || _b === void 0 ? void 0 : _b.transaction; _i < _d.length; _i++) {
                var transaction = _d[_i];
                if (((_c = transaction === null || transaction === void 0 ? void 0 : transaction.inputMap) === null || _c === void 0 ? void 0 : _c.address) === address) {
                    hasTransaction = true;
                    break;
                }
                var outputValue = void 0;
                try {
                    outputValue = transaction === null || transaction === void 0 ? void 0 : transaction.outputMap[address];
                }
                catch (error) {
                    outputValue = 0;
                }
                if (outputValue) {
                    value += outputValue;
                }
            }
            if (hasTransaction) {
                break;
            }
        }
        return value;
    };
    return Wallet;
}());
exports.Wallet = Wallet;
