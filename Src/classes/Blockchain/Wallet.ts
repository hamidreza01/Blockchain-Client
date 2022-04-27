import { _Wallet } from "../../interfaces/Blockchain/_Wallet";
import { ec } from "../../Addon/sign";
import { config } from "../../../config";
import { hashCreator } from "../../Addon/hash-creator";
import { _Errors } from "../../types/errors_interface";
import { _Transaction } from "../../interfaces/Blockchain/_Transaction";
import { Transaction } from "./Transaction";
import { _Block } from "../../interfaces/Blockchain/_Block";

export class Wallet implements _Wallet {
  balance: number = config.DEFUALT_BALANCE;
  keyPair: any = ec.genKeyPair();
  publicKey: string = this.keyPair.getPublic().encode("hex");
  privateKey: string = Buffer.from(JSON.stringify(this.keyPair.getPrivate()).replace(/\"/g,'')).toString("base64");
  // privateKey: string = this.keyPair.getPrivate();
  sign(data: any): string {
    return this.keyPair.sign(hashCreator(JSON.stringify(data)));
  }
  createTransaction(
    recipient: string,
    amount: number,
    chain: Array<_Block>
  ): _Errors | _Transaction {
    this.balance = Wallet.calculateBalance(chain, this.publicKey)!;
   // console.log(amount , this.balance)
    if (amount > this.balance) {
      return { message: "amount exceeds balance", code: 112 };
    }
    return new Transaction(this, amount, recipient);
  }
  static calculateBalance(chain: Array<_Block>, address: string) {
    let value = 0;
    let hasTransaction = false;
    for (let i = chain?.length - 1; i > 0; i--) {
      for (let transaction of Object.values(chain[i]?.data?.transaction!)) {
        if(transaction?.inputMap?.address === address){
          hasTransaction = true;
          // break;
        }
        let outputValue;
        try {
          outputValue = transaction?.outputMap[address];
        } catch (error) {
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
