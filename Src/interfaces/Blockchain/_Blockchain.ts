import { _Block } from "./_Block";
import { _Errors } from "../../types/errors_interface";

export interface _Blockchain {
  chain: Array<_Block>;
  addBlock: (data: Array<any>) => void;
  replaceChain: (chain : Array<_Block>) => _Errors | boolean
}
