import { inputMap_type } from "../../types/inputMap_types";
import { _Wallet } from "./_Wallet";

export interface _Transaction {
  id: string;
  inputMap: inputMap_type;
  outputMap: Object;
  inputMapCreator: (senderWallet: _Wallet, outputMap: {}) => {};
  outputMapCreator: (
    senderWallet: _Wallet,
    amount: number,
    recipient: string
  ) => {};
}
