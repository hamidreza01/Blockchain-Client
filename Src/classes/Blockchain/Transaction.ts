import { _Transaction } from "../../interfaces/Blockchain/_Transaction";
import { _Wallet } from "../../interfaces/Blockchain/_Wallet";
import uniqid from "uniqid";
import { _Errors } from "../../types/errors_interface";
import { verify } from "../../Addon/sign";
import { inputMap_type } from "../../types/inputMap_types";
export class Transaction implements _Transaction {
  id: string = uniqid();
  public outputMap: Object = {};
  public inputMap: inputMap_type =  {
    timestamp: 0,
    address: '',
    amount: 0,
    signature: {s : "" ,r : ""},
  };;
  constructor(senderWallet: _Wallet, amount: number, recpient: string) {
    (this.outputMap = this.outputMapCreator(senderWallet, amount, recpient)),
      (this.inputMap = this.inputMapCreator(senderWallet, this.outputMap));
  }
  inputMapCreator(senderWallet: _Wallet, outputMap: {}): inputMap_type {
    return {
      timestamp: Date.now(),
      address: senderWallet.publicKey,
      amount: senderWallet.balance,
      signature: senderWallet.sign(outputMap),
    };
  }
  outputMapCreator(
    senderWallet: _Wallet,
    amount: number,
    recipient: string
  ): {} {
    let outputMap: any = {};
    outputMap[senderWallet.publicKey] = senderWallet.balance - amount;
    outputMap[recipient] = amount;
    return outputMap;
  }
  static isValid(transaction: _Transaction): _Errors | boolean {
    let total = Object.values(transaction.outputMap).reduce((all, val) => {
      return all + val;
    });
    if (total !== transaction.inputMap.amount) {
      return {message : `invalid transaction from ${transaction.inputMap.address}` , code : 111}
    }
    if (!verify(transaction.outputMap,transaction.inputMap.signature,transaction.inputMap.address)) {
      return {message : `invalid transaction from ${transaction.inputMap.address}` , code : 112}
    }
    return true;
  }
}
