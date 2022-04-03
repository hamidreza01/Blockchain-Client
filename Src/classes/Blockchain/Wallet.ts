import { _Wallet } from "../../interfaces/Blockchain/_Wallet";
import { ec } from "../../Addon/sign";
import { config } from "../../../config";
import { hashCreator } from "../../Addon/hash-creator";
export class Wallet implements _Wallet {
  balance: number = config.DEFUALT_BALANCE;
  keyPair: any = ec.genKeyPair();
  publicKey: string = this.keyPair.getPublic().encode('hex');
  sign(data: any): string {
    return this.keyPair.sign(hashCreator(JSON.stringify(data)));
  }
}
