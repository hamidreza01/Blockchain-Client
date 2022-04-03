import { _Block } from "./_Block";
import { _Errors } from "./_Errors";

export interface _Blockchain {
  readonly chain: Array<_Block>;
  addBlock: (data: Array<any>) => void;
  replaceChain: (chain : Array<_Block>) => _Errors | string
}
