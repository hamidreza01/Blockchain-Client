"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.recoveryKeyPair = exports.verify = exports.ec = void 0;
const elliptic_1 = __importDefault(require("elliptic"));
const hash_creator_1 = require("./hash-creator");
exports.ec = new elliptic_1.default.ec("ed25519");
const verify = (data, sign, publicKey) => {
    const vrf = exports.ec.keyFromPublic(publicKey, "hex");
    try {
        return vrf.verify((0, hash_creator_1.hashCreator)(JSON.stringify(data)), sign);
    }
    catch (error) {
        return false;
    }
};
exports.verify = verify;
const recoveryKeyPair = (privateKey, publicKey) => {
    return exports.ec.keyPair({
        "priv": Buffer.from(privateKey, 'base64').toString(),
        "pubEnc": publicKey,
    });
};
exports.recoveryKeyPair = recoveryKeyPair;
