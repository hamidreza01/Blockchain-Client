import { _Block } from "./_Block";
import { _Errors } from "../../types/errors_interface";
import { _Transaction } from "./_Transaction";
export interface _Blockchain {
  chain: Array<_Block>;
  addBlock : (data: { transaction : [_Transaction] }) => void
  replaceChain: (chain : Array<_Block>) => _Errors | boolean
  validTransactionData : (chain: Array<_Block>) => boolean | _Errors 
}