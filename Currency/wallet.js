let { defBalance } = require("../config");
const {ec} = require("../Addon/pub-pri");
const cryptoHash = require("../Addon/hash-function");
const Transaction = require("./transaction");
class Wallet {
  constructor() {
    this.balance = defBalance;
    this.keyPair = ec.genKeyPair();
    this.publicKey = this.keyPair.getPublic().encode("hex");
  }
  sign(data) {
    return this.keyPair.sign(cryptoHash(data));
  }
  createTransaction({recipient,amount}){
    if(amount > this.balance){
      throw new Error('amount exceeds balance');
    }
    return new Transaction({senderWallet : this , recipient : amount})
  }
}

module.exports = Wallet;
