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
        this.publicKey = this.keyPair.getPublic().encode('hex');
    }
    Wallet.prototype.sign = function (data) {
        return this.keyPair.sign((0, hash_creator_1.hashCreator)(JSON.stringify(data)));
    };
    Wallet.prototype.createTransaction = function (recipient, amount) {
        if (amount > this.balance) {
            return { message: "amount exceeds balance", code: 112 };
        }
        return new Transaction_1.Transaction(this, amount, recipient);
    };
    return Wallet;
}());
exports.Wallet = Wallet;
