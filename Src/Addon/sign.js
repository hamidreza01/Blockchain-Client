"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
exports.__esModule = true;
exports.verify = exports.ec = void 0;
var elliptic_1 = __importDefault(require("elliptic"));
var hash_creator_1 = require("./hash-creator");
exports.ec = new elliptic_1["default"].ec("ed25519");
var verify = function (data, sign, publicKey) {
    var vrf = exports.ec.keyFromPublic(publicKey, "hex");
    try {
        return vrf.verify((0, hash_creator_1.hashCreator)(JSON.stringify(data)), sign);
    }
    catch (error) {
        return false;
    }
};
exports.verify = verify;
