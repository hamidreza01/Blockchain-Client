const { v1 } = require("uuid");
const { verifySign } = require("../Addon/pub-pri");
class Transaction {
  constructor({ senderWallet, amount, recipient }) {
    this.id = v1();
    this.outputMap = this.outputMapCreator({ senderWallet, amount, recipient });
    this.input = this.inputCreator({ senderWallet, outputMap : this.outputMap});
  }
  outputMapCreator({ senderWallet, amount, recipient }) {
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
  static isValid(transaction){
    const {outputMap,input : {amount , address , signature}} = transaction;
    const total = Object.values(outputMap).reduce((all , val)=>{
      return all + val;
    })
    if(amount !== total){
      console.error(`invalid transaction from ${address}`);
      return false;
    }
    if(!verifySign({data : outputMap , sign : signature, publicKey : address})){
      console.error(`invalid transaction from ${address}`);
      return false;
    }
    return true;
  }
  update({recipient,amount,senderWallet}){
    if(amount > this.outputMap[senderWallet.publicKey]){
      throw new Error('amount exceeds balance')
    }
    if(!this.outputMap[recipient]){
      this.outputMap[recipient] = amount;
    }else{
      this.outputMap[recipient] += amount;
    }
    
    this.outputMap[senderWallet.publicKey] -= amount;
    this.input = this.inputCreator({senderWallet,outputMap : this.outputMap})
  }
}
module.exports = Transaction;