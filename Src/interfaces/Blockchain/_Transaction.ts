import { _Errors } from "../../types/errors_interface";
import { inputMap_type } from "../../types/inputMap_types";
import { _Wallet } from "./_Wallet";

export interface _Transaction {
  id: string;
  inputMap: inputMap_type;
  outputMap: any;
  inputMapCreator: (senderWallet: _Wallet, outputMap: {}) => {};
  outputMapCreator: (
    senderWallet: _Wallet,
    amount: number,
    recipient: string
  ) => {};
  update : (recipient: string,amount : number,senderWallet : _Wallet) => void | _Errors ; 
}
