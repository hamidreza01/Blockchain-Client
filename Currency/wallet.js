let { defBalance } = require("../config");
const {ec} = require("../Addon/pub-pri");
const cryptoHash = require("../Addon/hash-function");
class Wallet {
  constructor() {
    this.balance = defBalance;
    this.keyPair = ec.genKeyPair();
    this.publicKey = this.keyPair.getPublic().encode("hex");
  }
  sign(data) {
    return this.keyPair.sign(cryptoHash(data));
  }
}

module.exports = Wallet;
