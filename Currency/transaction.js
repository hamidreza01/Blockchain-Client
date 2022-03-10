const { v1 } = require("uuid");
class Transaction {
  constructor({ senderWallet, amount, recipient }) {
    this.id = v1();
    this.outputMap = this.outpuMapCreator({ senderWallet, amount, recipient });
    this.input = this.inputCreator({ senderWallet, outputMap : this.outputMap});
  }
  outpuMapCreator({ senderWallet, amount, recipient }) {
    let outputMap = {};
    outputMap[senderWallet.publicKey] = senderWallet.balance - amount;
    outputMap[recipient] = amount;
    return outputMap;
  }
  inputCreator({ senderWallet, outputMap }){
      return {
          timestamp : Date.now(),
          address : senderWallet.publicKey,
          amount : senderWallet.balance,
          signature : senderWallet.sign(outputMap)
      }
  }
}
module.exports = Transaction;