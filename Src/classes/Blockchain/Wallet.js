"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Wallet = void 0;
const sign_1 = require("../../Addon/sign");
const config_1 = require("../../../config");
const hash_creator_1 = require("../../Addon/hash-creator");
const Transaction_1 = require("./Transaction");
class Wallet {
    constructor() {
        this.balance = config_1.config.DEFUALT_BALANCE;
        this.keyPair = sign_1.ec.genKeyPair();
        this.publicKey = this.keyPair.getPublic().encode("hex");
        this.privateKey = Buffer.from(JSON.stringify(this.keyPair.getPrivate()).replace(/\"/g, '')).toString("base64");
    }
    // privateKey: string = this.keyPair.getPrivate();
    sign(data) {
        return this.keyPair.sign((0, hash_creator_1.hashCreator)(JSON.stringify(data)));
    }
    createTransaction(recipient, amount, chain) {
        this.balance = Wallet.calculateBalance(chain, this.publicKey);
        // console.log(amount , this.balance)
        if (amount > this.balance) {
            return { message: "amount exceeds balance", code: 112 };
        }
        return new Transaction_1.Transaction(this, amount, recipient);
    }
    static calculateBalance(chain, address) {
        var _a, _b, _c;
        let value = 0;
        let hasTransaction = false;
        for (let i = (chain === null || chain === void 0 ? void 0 : chain.length) - 1; i > 0; i--) {
            for (let transaction of Object.values((_b = (_a = chain[i]) === null || _a === void 0 ? void 0 : _a.data) === null || _b === void 0 ? void 0 : _b.transaction)) {
                if (((_c = transaction === null || transaction === void 0 ? void 0 : transaction.inputMap) === null || _c === void 0 ? void 0 : _c.address) === address) {
                    hasTransaction = true;
                    // break;
                }
                let outputValue;
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
    }
}
exports.Wallet = Wallet;
