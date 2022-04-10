import { _Wallet } from "../../interfaces/Blockchain/_Wallet";
import { ec } from "../../Addon/sign";
import { config } from "../../../config";
import { hashCreator } from "../../Addon/hash-creator";
import { _Errors } from "../../types/errors_interface";
import { _Transaction } from "../../interfaces/Blockchain/_Transaction";
import { Transaction } from "./Transaction";
export class Wallet implements _Wallet {
  balance: number = config.DEFUALT_BALANCE;
  keyPair: any = ec.genKeyPair();
  publicKey: string = this.keyPair.getPublic().encode('hex');
  sign(data: any): string {
    return this.keyPair.sign(hashCreator(JSON.stringify(data)));
  }
  createTransaction( recipient : string, amount : number ) : (_Errors | _Transaction){
    if (amount > this.balance) {
      return {message : "amount exceeds balance", code : 112 };
    }
    return new Transaction (this,amount,recipient) ;
  }
}
